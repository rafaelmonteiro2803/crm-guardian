-- =====================================================
-- Migration: Login por tenant + criar tenant ELP
-- Adiciona função pública para listar tenants no login
-- Cria tenant "ELP" e vincula rafaelmonteiro.2803@gmail.com
-- =====================================================

-- 1. Função pública para listar todos os tenants (usada no dropdown de login)
CREATE OR REPLACE FUNCTION public.get_all_tenants()
RETURNS TABLE (id UUID, nome TEXT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, nome FROM tenants ORDER BY nome;
$$;

-- Permitir acesso anônimo e autenticado
GRANT EXECUTE ON FUNCTION public.get_all_tenants() TO anon;
GRANT EXECUTE ON FUNCTION public.get_all_tenants() TO authenticated;

-- 2. Criar o tenant "ELP"
INSERT INTO tenants (nome) VALUES ('ELP')
ON CONFLICT DO NOTHING;

-- 3. Vincular rafaelmonteiro.2803@gmail.com ao tenant "ELP"
INSERT INTO tenant_members (tenant_id, user_id, role)
SELECT t.id, u.id, 'owner'
FROM tenants t, auth.users u
WHERE t.nome = 'ELP'
  AND u.email = 'rafaelmonteiro.2803@gmail.com'
ON CONFLICT (tenant_id, user_id) DO NOTHING;
