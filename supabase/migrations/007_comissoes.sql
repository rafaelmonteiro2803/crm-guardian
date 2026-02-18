-- =====================================================
-- Migration: Gestão de Comissões
-- Gerada ao concluir uma Ordem de Serviço com técnico
-- =====================================================

CREATE TABLE IF NOT EXISTS comissoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_servico_id UUID REFERENCES ordens_servico(id) ON DELETE CASCADE,
    tecnico_id UUID REFERENCES tecnicos(id) ON DELETE SET NULL,
    valor NUMERIC(12,2) DEFAULT 0,
    percentual NUMERIC(5,2) DEFAULT 0,
    status TEXT DEFAULT 'pendente'
        CHECK (status IN ('pendente', 'agendado', 'pago')),
    data_agendamento DATE,
    data_pagamento DATE,
    observacoes TEXT,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comissoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comissoes_select" ON comissoes FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "comissoes_insert" ON comissoes FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "comissoes_update" ON comissoes FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "comissoes_delete" ON comissoes FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS comissoes_tenant_id_idx ON comissoes(tenant_id);
CREATE INDEX IF NOT EXISTS comissoes_tecnico_id_idx ON comissoes(tecnico_id);
CREATE INDEX IF NOT EXISTS comissoes_status_idx ON comissoes(status);
CREATE INDEX IF NOT EXISTS comissoes_ordem_servico_id_idx ON comissoes(ordem_servico_id);
