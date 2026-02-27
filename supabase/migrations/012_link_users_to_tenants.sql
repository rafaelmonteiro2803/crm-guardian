-- =====================================================
-- Migration: Vincular usuários existentes a tenants
-- Membros de tenant passam a ser selecionados a partir
-- dos usuários já cadastrados no sistema (auth.users
-- que já possuem ao menos um vínculo de tenant).
-- Remove funções baseadas em email para owner e
-- adiciona funções baseadas em user_id.
-- =====================================================

-- 1. Função para listar todos os usuários do sistema (owner)
--    Retorna todos os auth.users que já estão vinculados
--    a pelo menos um tenant (cadastrados no módulo de usuários).
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
    SELECT 1 FROM public.tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
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

-- 2. Função para adicionar membro por user_id em qualquer tenant (somente owners)
--    Substitui add_tenant_member_for_owner (baseado em email)
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
    SELECT 1 FROM public.tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
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
    WHERE tenant_id = p_tenant_id AND user_id = p_user_id
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

-- 3. Função para listar usuários do sistema acessível a membros do tenant
--    Retorna todos os usuários já cadastrados no módulo de usuários
--    (vinculados a qualquer tenant), excluindo os já membros do tenant informado.
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
  -- Verificar se o chamador é membro do tenant
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
    SELECT user_id FROM public.tenant_members WHERE tenant_id = p_tenant_id
  )
  ORDER BY u.email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_system_users_for_tenant(UUID) TO authenticated;

-- 4. Função para adicionar membro por user_id no tenant corrente
--    Substitui add_tenant_member_by_email (baseado em email)
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
  -- Verificar se o chamador é membro do tenant
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
    SELECT 1 FROM public.tenant_members
    WHERE tenant_id = p_tenant_id AND user_id = p_user_id
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

-- 5. Remover funções baseadas em email (agora substituídas por user_id)
DROP FUNCTION IF EXISTS public.add_tenant_member_for_owner(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.add_tenant_member_by_email(UUID, TEXT, TEXT);
