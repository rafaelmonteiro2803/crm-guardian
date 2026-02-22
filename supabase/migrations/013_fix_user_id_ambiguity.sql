-- =====================================================
-- Migration: Corrigir ambiguidade de 'user_id'
-- Funções com RETURNS TABLE (user_id UUID, ...) causavam
-- "column reference 'user_id' is ambiguous" pois o PostgreSQL
-- confundia o parâmetro OUT com a coluna da tabela nos EXISTS.
-- Solução: qualificar 'user_id' com o nome da tabela em todos
-- os EXISTS/WHERE internos afetados.
-- =====================================================

-- 1. Corrigir get_tenant_members_for_owner
CREATE OR REPLACE FUNCTION public.get_tenant_members_for_owner(p_tenant_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  role TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members tm_check
    WHERE tm_check.user_id = auth.uid() AND tm_check.role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  RETURN QUERY
  SELECT
    tm.id,
    tm.user_id,
    u.email::text,
    tm.role,
    tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.tenant_id = p_tenant_id
  ORDER BY tm.created_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_tenant_members_for_owner(UUID) TO authenticated;

-- 2. Corrigir update_tenant_member_role_for_owner
CREATE OR REPLACE FUNCTION public.update_tenant_member_role_for_owner(
  p_member_id UUID,
  p_tenant_id UUID,
  p_role TEXT
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  role TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members tm_check
    WHERE tm_check.user_id = auth.uid() AND tm_check.role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  UPDATE public.tenant_members
  SET role = p_role
  WHERE public.tenant_members.id = p_member_id
    AND public.tenant_members.tenant_id = p_tenant_id;

  RETURN QUERY
  SELECT tm.id, tm.user_id, u.email::text, tm.role, tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.id = p_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_tenant_member_role_for_owner(UUID, UUID, TEXT) TO authenticated;

-- 3. Corrigir get_all_system_users_for_owner (migration 012)
CREATE OR REPLACE FUNCTION public.get_all_system_users_for_owner()
RETURNS TABLE (
  user_id UUID,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members tm_check
    WHERE tm_check.user_id = auth.uid() AND tm_check.role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  RETURN QUERY
  SELECT DISTINCT u.id AS user_id, u.email::text
  FROM auth.users u
  INNER JOIN public.tenant_members tm ON tm.user_id = u.id
  ORDER BY u.email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_system_users_for_owner() TO authenticated;

-- 4. Corrigir add_tenant_member_by_userid_for_owner (migration 012)
CREATE OR REPLACE FUNCTION public.add_tenant_member_by_userid_for_owner(
  p_tenant_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'member'
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  role TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_member_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members tm_check
    WHERE tm_check.user_id = auth.uid() AND tm_check.role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_id = p_tenant_id AND public.tenant_members.user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário já é membro deste tenant';
  END IF;

  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (p_tenant_id, p_user_id, p_role)
  RETURNING public.tenant_members.id INTO v_member_id;

  RETURN QUERY
  SELECT tm.id, tm.user_id, u.email::text, tm.role, tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.id = v_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_tenant_member_by_userid_for_owner(UUID, UUID, TEXT) TO authenticated;

-- 5. Corrigir get_system_users_for_tenant (migration 012)
CREATE OR REPLACE FUNCTION public.get_system_users_for_tenant(p_tenant_id UUID)
RETURNS TABLE (
  user_id UUID,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members req
    WHERE req.tenant_id = p_tenant_id AND req.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Você não é membro deste tenant';
  END IF;

  RETURN QUERY
  SELECT DISTINCT u.id AS user_id, u.email::text
  FROM auth.users u
  INNER JOIN public.tenant_members tm ON tm.user_id = u.id
  WHERE u.id NOT IN (
    SELECT tm2.user_id FROM public.tenant_members tm2 WHERE tm2.tenant_id = p_tenant_id
  )
  ORDER BY u.email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_system_users_for_tenant(UUID) TO authenticated;

-- 6. Corrigir add_tenant_member_by_userid (migration 012)
CREATE OR REPLACE FUNCTION public.add_tenant_member_by_userid(
  p_tenant_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'member'
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  role TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_member_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members req
    WHERE req.tenant_id = p_tenant_id AND req.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Você não é membro deste tenant';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.tenant_members tm_check
    WHERE tm_check.tenant_id = p_tenant_id AND tm_check.user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário já é membro deste tenant';
  END IF;

  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (p_tenant_id, p_user_id, p_role)
  RETURNING public.tenant_members.id INTO v_member_id;

  RETURN QUERY
  SELECT tm.id, tm.user_id, u.email::text, tm.role, tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.id = v_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_tenant_member_by_userid(UUID, UUID, TEXT) TO authenticated;
