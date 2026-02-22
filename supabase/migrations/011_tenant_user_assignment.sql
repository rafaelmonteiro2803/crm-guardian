-- =====================================================
-- Migration: Gestão de membros de tenant pelo owner
-- Permite que usuários com perfil owner gerenciem membros
-- de qualquer tenant, sem precisar ser membro do tenant alvo.
-- =====================================================

-- 1. RPC: Listar membros de qualquer tenant (somente owners)
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
    SELECT 1 FROM public.tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
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

-- 2. RPC: Adicionar membro a qualquer tenant (somente owners)
CREATE OR REPLACE FUNCTION public.add_tenant_member_for_owner(
  p_tenant_id UUID,
  p_email TEXT,
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
  v_user_id UUID;
  v_member_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  SELECT u.id INTO v_user_id
  FROM auth.users u
  WHERE u.email = p_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com email "%" não encontrado', p_email;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_id = p_tenant_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário já é membro deste tenant';
  END IF;

  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (p_tenant_id, v_user_id, p_role)
  RETURNING public.tenant_members.id INTO v_member_id;

  RETURN QUERY
  SELECT tm.id, tm.user_id, u.email::text, tm.role, tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.id = v_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_tenant_member_for_owner(UUID, TEXT, TEXT) TO authenticated;

-- 3. RPC: Alterar role de membro em qualquer tenant (somente owners)
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
    SELECT 1 FROM public.tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
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

-- 4. RPC: Remover membro de qualquer tenant (somente owners)
CREATE OR REPLACE FUNCTION public.remove_tenant_member_for_owner(
  p_member_id UUID,
  p_tenant_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  DELETE FROM public.tenant_members
  WHERE public.tenant_members.id = p_member_id
    AND public.tenant_members.tenant_id = p_tenant_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_tenant_member_for_owner(UUID, UUID) TO authenticated;
