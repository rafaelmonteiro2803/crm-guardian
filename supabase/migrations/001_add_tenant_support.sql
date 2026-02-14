-- =====================================================
-- Migration: Adicionar suporte a multi-tenant
-- Tenant: "Sala Isis"
-- Usuários: rafaelmonteiro.2803@gmail.com, robertaisis@gmail.com
-- =====================================================

-- 1. Criar tabela de tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de membros do tenant
CREATE TABLE IF NOT EXISTS tenant_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- 3. Adicionar tenant_id em todas as tabelas de dados
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE oportunidades ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE vendas ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE titulos ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- 4. Criar o tenant "Sala Isis"
INSERT INTO tenants (nome) VALUES ('Sala Isis')
ON CONFLICT DO NOTHING;

-- 5. Vincular ambos os usuários ao tenant "Sala Isis"
INSERT INTO tenant_members (tenant_id, user_id)
SELECT t.id, u.id
FROM tenants t, auth.users u
WHERE t.nome = 'Sala Isis'
  AND u.email IN ('rafaelmonteiro.2803@gmail.com', 'robertaisis@gmail.com')
ON CONFLICT (tenant_id, user_id) DO NOTHING;

-- 6. Atualizar TODOS os dados existentes para pertencer ao tenant "Sala Isis"
UPDATE clientes SET tenant_id = (SELECT id FROM tenants WHERE nome = 'Sala Isis') WHERE tenant_id IS NULL;
UPDATE oportunidades SET tenant_id = (SELECT id FROM tenants WHERE nome = 'Sala Isis') WHERE tenant_id IS NULL;
UPDATE vendas SET tenant_id = (SELECT id FROM tenants WHERE nome = 'Sala Isis') WHERE tenant_id IS NULL;
UPDATE titulos SET tenant_id = (SELECT id FROM tenants WHERE nome = 'Sala Isis') WHERE tenant_id IS NULL;
UPDATE produtos SET tenant_id = (SELECT id FROM tenants WHERE nome = 'Sala Isis') WHERE tenant_id IS NULL;

-- 7. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_tenant_id ON clientes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_tenant_id ON oportunidades(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendas_tenant_id ON vendas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_titulos_tenant_id ON titulos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_produtos_tenant_id ON produtos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_user_id ON tenant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant_id ON tenant_members(tenant_id);

-- 8. Habilitar RLS em todas as tabelas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE titulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- 9. Políticas RLS para tenant_members
-- Usuário pode ver seus próprios memberships
DROP POLICY IF EXISTS "tenant_members_select" ON tenant_members;
CREATE POLICY "tenant_members_select" ON tenant_members
  FOR SELECT USING (user_id = auth.uid());

-- 10. Políticas RLS para tenants
-- Usuário pode ver tenants dos quais é membro
DROP POLICY IF EXISTS "tenants_select" ON tenants;
CREATE POLICY "tenants_select" ON tenants
  FOR SELECT USING (
    id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );

-- 11. Políticas RLS para clientes
DROP POLICY IF EXISTS "clientes_select" ON clientes;
DROP POLICY IF EXISTS "clientes_insert" ON clientes;
DROP POLICY IF EXISTS "clientes_update" ON clientes;
DROP POLICY IF EXISTS "clientes_delete" ON clientes;

CREATE POLICY "clientes_select" ON clientes
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "clientes_insert" ON clientes
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "clientes_update" ON clientes
  FOR UPDATE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "clientes_delete" ON clientes
  FOR DELETE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );

-- 12. Políticas RLS para oportunidades
DROP POLICY IF EXISTS "oportunidades_select" ON oportunidades;
DROP POLICY IF EXISTS "oportunidades_insert" ON oportunidades;
DROP POLICY IF EXISTS "oportunidades_update" ON oportunidades;
DROP POLICY IF EXISTS "oportunidades_delete" ON oportunidades;

CREATE POLICY "oportunidades_select" ON oportunidades
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "oportunidades_insert" ON oportunidades
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "oportunidades_update" ON oportunidades
  FOR UPDATE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "oportunidades_delete" ON oportunidades
  FOR DELETE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );

-- 13. Políticas RLS para vendas
DROP POLICY IF EXISTS "vendas_select" ON vendas;
DROP POLICY IF EXISTS "vendas_insert" ON vendas;
DROP POLICY IF EXISTS "vendas_update" ON vendas;
DROP POLICY IF EXISTS "vendas_delete" ON vendas;

CREATE POLICY "vendas_select" ON vendas
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "vendas_insert" ON vendas
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "vendas_update" ON vendas
  FOR UPDATE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "vendas_delete" ON vendas
  FOR DELETE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );

-- 14. Políticas RLS para titulos
DROP POLICY IF EXISTS "titulos_select" ON titulos;
DROP POLICY IF EXISTS "titulos_insert" ON titulos;
DROP POLICY IF EXISTS "titulos_update" ON titulos;
DROP POLICY IF EXISTS "titulos_delete" ON titulos;

CREATE POLICY "titulos_select" ON titulos
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "titulos_insert" ON titulos
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "titulos_update" ON titulos
  FOR UPDATE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "titulos_delete" ON titulos
  FOR DELETE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );

-- 15. Políticas RLS para produtos
DROP POLICY IF EXISTS "produtos_select" ON produtos;
DROP POLICY IF EXISTS "produtos_insert" ON produtos;
DROP POLICY IF EXISTS "produtos_update" ON produtos;
DROP POLICY IF EXISTS "produtos_delete" ON produtos;

CREATE POLICY "produtos_select" ON produtos
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "produtos_insert" ON produtos
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "produtos_update" ON produtos
  FOR UPDATE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
CREATE POLICY "produtos_delete" ON produtos
  FOR DELETE USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
  );
