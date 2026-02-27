-- =====================================================
-- Migration: Corrigir listagem de usuários disponíveis
-- As funções anteriores só retornavam usuários já em
-- tenant_members. Agora retornam TODOS os auth.users,
-- garantindo que qualquer usuário registrado possa ser
-- vinculado a um tenant.
-- =====================================================

-- 1. get_all_system_users_for_owner: retorna TODOS os auth.users
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
  SELECT u.id AS user_id, u.email::text
  FROM auth.users u
  WHERE u.email IS NOT NULL
  ORDER BY u.email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_system_users_for_owner() TO authenticated;

-- 2. get_system_users_for_tenant: retorna TODOS os auth.users
--    excluindo os já membros do tenant informado
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
  SELECT u.id AS user_id, u.email::text
  FROM auth.users u
  WHERE u.email IS NOT NULL
    AND u.id NOT IN (
      SELECT tm2.user_id FROM public.tenant_members tm2
      WHERE tm2.tenant_id = p_tenant_id
    )
  ORDER BY u.email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_system_users_for_tenant(UUID) TO authenticated;
