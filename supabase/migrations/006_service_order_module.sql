-- =====================================================
-- Migration: Módulo de Ordem de Serviço e Técnicos
-- =====================================================

-- Tabela de Técnicos Responsáveis (dados cadastrais)
CREATE TABLE IF NOT EXISTS tecnicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cpf TEXT,
    email TEXT,
    telefone TEXT,
    especialidade TEXT,
    endereco TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Ordens de Serviço
CREATE TABLE IF NOT EXISTS ordens_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_os TEXT,
    venda_id UUID REFERENCES vendas(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    tecnico_id UUID REFERENCES tecnicos(id) ON DELETE SET NULL,
    descricao TEXT,
    itens JSONB DEFAULT '[]',
    valor_total NUMERIC(12,2) DEFAULT 0,
    comissao_percentual NUMERIC(5,2) DEFAULT 0,
    comissao_valor NUMERIC(12,2) DEFAULT 0,
    status TEXT DEFAULT 'aguardando_atendimento'
        CHECK (status IN ('aguardando_atendimento', 'em_atendimento', 'atendimento_concluido')),
    data_abertura DATE,
    data_atribuicao TIMESTAMPTZ,
    data_conclusao TIMESTAMPTZ,
    observacoes TEXT,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tecnicos
CREATE POLICY "tecnicos_select" ON tecnicos FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "tecnicos_insert" ON tecnicos FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "tecnicos_update" ON tecnicos FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "tecnicos_delete" ON tecnicos FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Políticas RLS para ordens_servico
CREATE POLICY "ordens_servico_select" ON ordens_servico FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "ordens_servico_insert" ON ordens_servico FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "ordens_servico_update" ON ordens_servico FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "ordens_servico_delete" ON ordens_servico FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Índices para performance
CREATE INDEX IF NOT EXISTS tecnicos_tenant_id_idx ON tecnicos(tenant_id);
CREATE INDEX IF NOT EXISTS tecnicos_ativo_idx ON tecnicos(ativo);
CREATE INDEX IF NOT EXISTS ordens_servico_tenant_id_idx ON ordens_servico(tenant_id);
CREATE INDEX IF NOT EXISTS ordens_servico_venda_id_idx ON ordens_servico(venda_id);
CREATE INDEX IF NOT EXISTS ordens_servico_status_idx ON ordens_servico(status);
CREATE INDEX IF NOT EXISTS ordens_servico_tecnico_id_idx ON ordens_servico(tecnico_id);
