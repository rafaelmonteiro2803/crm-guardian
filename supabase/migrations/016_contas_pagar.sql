-- =====================================================
-- Migration: Módulo de Contas a Pagar
-- Inclui: Fornecedores, Centros de Custo, Contas a Pagar e Parcelas
-- =====================================================

-- =====================================================
-- FORNECEDORES
-- =====================================================
CREATE TABLE IF NOT EXISTS fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj TEXT,
    cpf TEXT,
    email TEXT,
    telefone TEXT,
    contato TEXT,
    categoria TEXT DEFAULT 'outro'
        CHECK (categoria IN ('produto', 'servico', 'utilidades', 'aluguel', 'outro')),
    endereco TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fornecedores_select" ON fornecedores FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "fornecedores_insert" ON fornecedores FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "fornecedores_update" ON fornecedores FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "fornecedores_delete" ON fornecedores FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS fornecedores_tenant_id_idx ON fornecedores(tenant_id);
CREATE INDEX IF NOT EXISTS fornecedores_ativo_idx ON fornecedores(ativo);


-- =====================================================
-- CENTROS DE CUSTO
-- =====================================================
CREATE TABLE IF NOT EXISTS centros_custo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    codigo TEXT,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE centros_custo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "centros_custo_select" ON centros_custo FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "centros_custo_insert" ON centros_custo FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "centros_custo_update" ON centros_custo FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "centros_custo_delete" ON centros_custo FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS centros_custo_tenant_id_idx ON centros_custo(tenant_id);


-- =====================================================
-- CONTAS A PAGAR (Despesa / Título)
-- Representa uma obrigação financeira a pagar
-- Pode ter múltiplas parcelas (contas_pagar_parcelas)
-- =====================================================
CREATE TABLE IF NOT EXISTS contas_pagar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'outros'
        CHECK (categoria IN (
            'aluguel', 'fornecedores', 'equipamentos', 'marketing',
            'funcionarios', 'impostos', 'taxas_cartao', 'servicos_publicos',
            'seguros', 'manutencao', 'contabilidade', 'juridico',
            'ti_software', 'transporte', 'combustivel', 'alimentacao',
            'treinamento', 'outros'
        )),
    tipo TEXT NOT NULL DEFAULT 'variavel'
        CHECK (tipo IN ('fixo', 'variavel')),
    valor_total NUMERIC(12,2) NOT NULL,
    numero_parcelas INTEGER NOT NULL DEFAULT 1,
    fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
    centro_custo_id UUID REFERENCES centros_custo(id) ON DELETE SET NULL,
    -- Referência ao módulo de estoque (quando gerado automaticamente)
    estoque_movimentacao_id UUID REFERENCES estoque_movimentacoes(id) ON DELETE SET NULL,
    data_competencia DATE NOT NULL DEFAULT CURRENT_DATE,
    data_primeira_parcela DATE NOT NULL DEFAULT CURRENT_DATE,
    observacoes TEXT,
    recorrente BOOLEAN DEFAULT FALSE,
    -- Para despesas recorrentes: quantos meses a repetir (0 = indefinido)
    recorrencia_meses INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contas_pagar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contas_pagar_select" ON contas_pagar FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "contas_pagar_insert" ON contas_pagar FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "contas_pagar_update" ON contas_pagar FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "contas_pagar_delete" ON contas_pagar FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS contas_pagar_tenant_id_idx ON contas_pagar(tenant_id);
CREATE INDEX IF NOT EXISTS contas_pagar_categoria_idx ON contas_pagar(categoria);
CREATE INDEX IF NOT EXISTS contas_pagar_fornecedor_id_idx ON contas_pagar(fornecedor_id);
CREATE INDEX IF NOT EXISTS contas_pagar_centro_custo_id_idx ON contas_pagar(centro_custo_id);


-- =====================================================
-- PARCELAS DAS CONTAS A PAGAR
-- Cada conta_pagar pode ter N parcelas
-- O pagamento é registrado por parcela
-- =====================================================
CREATE TABLE IF NOT EXISTS contas_pagar_parcelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conta_pagar_id UUID NOT NULL REFERENCES contas_pagar(id) ON DELETE CASCADE,
    numero_parcela INTEGER NOT NULL DEFAULT 1,
    valor NUMERIC(12,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'em_aberto'
        CHECK (status IN ('em_aberto', 'pago', 'vencido', 'cancelado')),
    data_pagamento DATE,
    valor_pago NUMERIC(12,2),
    -- Referência ao movimento bancário gerado no pagamento
    movimento_bancario_id UUID REFERENCES movimentos_bancarios(id) ON DELETE SET NULL,
    conta_bancaria_id UUID REFERENCES contas_bancarias(id) ON DELETE SET NULL,
    forma_pagamento TEXT DEFAULT 'pix'
        CHECK (forma_pagamento IN ('pix', 'cartao_credito', 'cartao_debito', 'dinheiro', 'boleto', 'transferencia', 'deposito', 'cheque', 'outro')),
    observacoes TEXT,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contas_pagar_parcelas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contas_pagar_parcelas_select" ON contas_pagar_parcelas FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "contas_pagar_parcelas_insert" ON contas_pagar_parcelas FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "contas_pagar_parcelas_update" ON contas_pagar_parcelas FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
CREATE POLICY "contas_pagar_parcelas_delete" ON contas_pagar_parcelas FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS parcelas_conta_pagar_id_idx ON contas_pagar_parcelas(conta_pagar_id);
CREATE INDEX IF NOT EXISTS parcelas_tenant_id_idx ON contas_pagar_parcelas(tenant_id);
CREATE INDEX IF NOT EXISTS parcelas_status_idx ON contas_pagar_parcelas(status);
CREATE INDEX IF NOT EXISTS parcelas_data_vencimento_idx ON contas_pagar_parcelas(data_vencimento);
CREATE INDEX IF NOT EXISTS parcelas_fornecedor_idx ON contas_pagar_parcelas(conta_pagar_id);
