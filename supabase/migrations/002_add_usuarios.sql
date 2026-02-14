-- =====================================================
-- Ajuste: expor email dos membros sem criar tabela de usuários
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_tenant_members_with_email(p_tenant_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  role TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT
    tm.id,
    tm.user_id,
    u.email::text,
    tm.role,
    tm.created_at
  FROM public.tenant_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.tenant_id = p_tenant_id
    AND EXISTS (
      SELECT 1
      FROM public.tenant_members req
      WHERE req.tenant_id = tm.tenant_id
        AND req.user_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_tenant_members_with_email(UUID) TO authenticated;
