-- =====================================================
-- Migration: Corrigir ambiguidade de 'id' em INSERT ... RETURNING
-- Funções com RETURNS TABLE (id UUID, ...) causavam
-- "column reference 'id' is ambiguous" ao usar
-- RETURNING tenant_members.id INTO v_member_id
-- pois o OUT parameter 'id' conflita com a coluna.
-- Solução: pré-gerar o UUID antes do INSERT, eliminando
-- a necessidade do RETURNING ... INTO.
-- =====================================================

-- 1. Corrigir add_tenant_member_by_userid_for_owner
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
  v_member_id UUID := gen_random_uuid();
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members tm_check
    WHERE tm_check.user_id = auth.uid() AND tm_check.role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE auth.users.id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.tenant_members tm_check
    WHERE tm_check.tenant_id = p_tenant_id AND tm_check.user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário já é membro deste tenant';
  END IF;

  INSERT INTO public.tenant_members (id, tenant_id, user_id, role)
  VALUES (v_member_id, p_tenant_id, p_user_id, p_role);

  RETURN QUERY
  SELECT tm.id, tm.user_id, u.email::text, tm.role, tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.id = v_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_tenant_member_by_userid_for_owner(UUID, UUID, TEXT) TO authenticated;

-- 2. Corrigir add_tenant_member_by_userid
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
  v_member_id UUID := gen_random_uuid();
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members req
    WHERE req.tenant_id = p_tenant_id AND req.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Você não é membro deste tenant';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE auth.users.id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.tenant_members tm_check
    WHERE tm_check.tenant_id = p_tenant_id AND tm_check.user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário já é membro deste tenant';
  END IF;

  INSERT INTO public.tenant_members (id, tenant_id, user_id, role)
  VALUES (v_member_id, p_tenant_id, p_user_id, p_role);

  RETURN QUERY
  SELECT tm.id, tm.user_id, u.email::text, tm.role, tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.id = v_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_tenant_member_by_userid(UUID, UUID, TEXT) TO authenticated;
