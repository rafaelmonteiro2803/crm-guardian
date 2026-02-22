-- =====================================================
-- Migration: Módulo de Movimentos Bancários e Conciliação
-- =====================================================

-- Contas bancárias (destinos dos recebimentos)
-- Exemplos: Itaú, PagBank, Dinheiro em Caixa, etc.
CREATE TABLE IF NOT EXISTS contas_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'banco'
        CHECK (tipo IN ('banco', 'pagamento_digital', 'caixa', 'carteira', 'outro')),
    banco TEXT,
    agencia TEXT,
    conta TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    observacoes TEXT,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movimentos bancários (entradas e saídas de recursos)
-- fonte_pagamento: como o cliente pagou (de onde veio o dinheiro)
-- conta_id: em qual conta/destino caiu o dinheiro
CREATE TABLE IF NOT EXISTS movimentos_bancarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conta_id UUID NOT NULL REFERENCES contas_bancarias(id) ON DELETE RESTRICT,
    tipo TEXT NOT NULL DEFAULT 'entrada'
        CHECK (tipo IN ('entrada', 'saida')),
    valor NUMERIC(12,2) NOT NULL,
    descricao TEXT NOT NULL,
    fonte_pagamento TEXT NOT NULL DEFAULT 'pix'
        CHECK (fonte_pagamento IN ('pix', 'cartao_credito', 'cartao_debito', 'dinheiro', 'boleto', 'transferencia', 'deposito', 'cheque', 'outro')),
    data_movimento DATE NOT NULL DEFAULT CURRENT_DATE,
    observacoes TEXT,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conciliações bancárias
-- Relaciona títulos pagos com movimentos bancários
-- Calcula diferença entre valor do título e valor efetivamente recebido
-- (taxa cobrada pelo banco ou processadora de cartão)
CREATE TABLE IF NOT EXISTS conciliacoes_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo_id UUID NOT NULL REFERENCES titulos(id) ON DELETE RESTRICT,
    movimento_bancario_id UUID NOT NULL REFERENCES movimentos_bancarios(id) ON DELETE RESTRICT,
    valor_titulo NUMERIC(12,2) NOT NULL,
    valor_movimento NUMERIC(12,2) NOT NULL,
    diferenca NUMERIC(12,2) GENERATED ALWAYS AS (valor_titulo - valor_movimento) STORED,
    percentual_taxa NUMERIC(6,4) GENERATED ALWAYS AS (
        CASE
            WHEN valor_titulo > 0 THEN ROUND(((valor_titulo - valor_movimento) / valor_titulo) * 100, 4)
            ELSE 0
        END
    ) STORED,
    data_conciliacao DATE NOT NULL DEFAULT CURRENT_DATE,
    observacoes TEXT,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(titulo_id, movimento_bancario_id)
);

-- Habilitar RLS
ALTER TABLE contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentos_bancarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE conciliacoes_bancarias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contas_bancarias
CREATE POLICY "contas_bancarias_select" ON contas_bancarias FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "contas_bancarias_insert" ON contas_bancarias FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "contas_bancarias_update" ON contas_bancarias FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "contas_bancarias_delete" ON contas_bancarias FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Políticas RLS para movimentos_bancarios
CREATE POLICY "movimentos_bancarios_select" ON movimentos_bancarios FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "movimentos_bancarios_insert" ON movimentos_bancarios FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "movimentos_bancarios_update" ON movimentos_bancarios FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "movimentos_bancarios_delete" ON movimentos_bancarios FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Políticas RLS para conciliacoes_bancarias
CREATE POLICY "conciliacoes_bancarias_select" ON conciliacoes_bancarias FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "conciliacoes_bancarias_insert" ON conciliacoes_bancarias FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "conciliacoes_bancarias_update" ON conciliacoes_bancarias FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "conciliacoes_bancarias_delete" ON conciliacoes_bancarias FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Índices para performance
CREATE INDEX IF NOT EXISTS contas_bancarias_tenant_id_idx ON contas_bancarias(tenant_id);
CREATE INDEX IF NOT EXISTS contas_bancarias_ativo_idx ON contas_bancarias(ativo);
CREATE INDEX IF NOT EXISTS movimentos_bancarios_tenant_id_idx ON movimentos_bancarios(tenant_id);
CREATE INDEX IF NOT EXISTS movimentos_bancarios_conta_id_idx ON movimentos_bancarios(conta_id);
CREATE INDEX IF NOT EXISTS movimentos_bancarios_data_idx ON movimentos_bancarios(data_movimento);
CREATE INDEX IF NOT EXISTS movimentos_bancarios_tipo_idx ON movimentos_bancarios(tipo);
CREATE INDEX IF NOT EXISTS conciliacoes_bancarias_tenant_id_idx ON conciliacoes_bancarias(tenant_id);
CREATE INDEX IF NOT EXISTS conciliacoes_bancarias_titulo_id_idx ON conciliacoes_bancarias(titulo_id);
CREATE INDEX IF NOT EXISTS conciliacoes_bancarias_movimento_id_idx ON conciliacoes_bancarias(movimento_bancario_id);
CREATE INDEX IF NOT EXISTS conciliacoes_bancarias_data_idx ON conciliacoes_bancarias(data_conciliacao);
