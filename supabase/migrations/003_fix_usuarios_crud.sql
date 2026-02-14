-- =====================================================
-- Migration: Corrigir CRUD de usuários (tenant_members)
-- - RPC para adicionar membro por email
-- - RPC para alterar role
-- - RPC para remover membro
-- - Políticas RLS para INSERT/UPDATE/DELETE
-- =====================================================

-- 1. Função para adicionar membro por email
CREATE OR REPLACE FUNCTION public.add_tenant_member_by_email(
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
  -- Verificar se o chamador é membro do tenant
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members req
    WHERE req.tenant_id = p_tenant_id AND req.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Você não é membro deste tenant';
  END IF;

  -- Buscar user_id pelo email
  SELECT u.id INTO v_user_id
  FROM auth.users u
  WHERE u.email = p_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com email "%" não encontrado', p_email;
  END IF;

  -- Inserir membro
  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (p_tenant_id, v_user_id, p_role)
  RETURNING public.tenant_members.id INTO v_member_id;

  -- Retornar dados completos
  RETURN QUERY
  SELECT tm.id, tm.user_id, u.email::text, tm.role, tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.id = v_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_tenant_member_by_email(UUID, TEXT, TEXT) TO authenticated;

-- 2. Função para alterar role de membro
CREATE OR REPLACE FUNCTION public.update_tenant_member_role(
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
  -- Verificar se o chamador é membro do tenant
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members req
    WHERE req.tenant_id = p_tenant_id AND req.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Você não é membro deste tenant';
  END IF;

  -- Atualizar role
  UPDATE public.tenant_members
  SET role = p_role
  WHERE public.tenant_members.id = p_member_id
    AND public.tenant_members.tenant_id = p_tenant_id;

  -- Retornar dados atualizados
  RETURN QUERY
  SELECT tm.id, tm.user_id, u.email::text, tm.role, tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.id = p_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_tenant_member_role(UUID, UUID, TEXT) TO authenticated;

-- 3. Função para remover membro
CREATE OR REPLACE FUNCTION public.remove_tenant_member(
  p_member_id UUID,
  p_tenant_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o chamador é membro do tenant
  IF NOT EXISTS (
    SELECT 1 FROM public.tenant_members req
    WHERE req.tenant_id = p_tenant_id AND req.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Você não é membro deste tenant';
  END IF;

  -- Remover membro
  DELETE FROM public.tenant_members
  WHERE public.tenant_members.id = p_member_id
    AND public.tenant_members.tenant_id = p_tenant_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_tenant_member(UUID, UUID) TO authenticated;
