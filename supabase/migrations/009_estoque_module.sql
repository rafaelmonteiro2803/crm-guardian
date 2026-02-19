-- =====================================================
-- Migration: Módulo de Estoque
-- Para clínicas de estética e salões de beleza
-- =====================================================

-- Categorias disponíveis:
-- cosmetico       = Cosméticos (cremes, sérum, tinturas, esmaltes...)
-- insumo          = Insumos (materiais consumidos em serviços)
-- descartavel     = Descartáveis (luvas, algodão, papel lençol...)
-- produto_revenda = Produtos de Revenda (vendidos ao cliente)
-- equipamento     = Equipamentos e Ferramentas
-- material_limpeza= Material de Limpeza e Higiene
-- embalagem       = Embalagens e Sacolas
-- outro           = Outros

-- Tabela de itens do estoque
CREATE TABLE IF NOT EXISTS estoque_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'insumo'
        CHECK (categoria IN ('cosmetico', 'insumo', 'descartavel', 'produto_revenda', 'equipamento', 'material_limpeza', 'embalagem', 'outro')),
    descricao TEXT,
    unidade_medida TEXT DEFAULT 'un',
    quantidade_atual NUMERIC(12,3) DEFAULT 0,
    quantidade_minima NUMERIC(12,3) DEFAULT 0,
    custo_unitario NUMERIC(12,2) DEFAULT 0,
    fornecedor TEXT,
    codigo_referencia TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de movimentações de estoque (entradas e saídas)
CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estoque_item_id UUID NOT NULL REFERENCES estoque_itens(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste')),
    quantidade NUMERIC(12,3) NOT NULL,
    custo_unitario NUMERIC(12,2) DEFAULT 0,
    motivo TEXT NOT NULL DEFAULT 'compra'
        CHECK (motivo IN ('compra', 'uso_servico', 'venda', 'ajuste', 'perda', 'devolucao', 'inventario')),
    referencia_id UUID,
    referencia_tipo TEXT,
    observacoes TEXT,
    data_movimentacao DATE NOT NULL DEFAULT CURRENT_DATE,
    user_id UUID REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de vínculos entre produto/serviço e itens de estoque
-- Define quais itens de estoque são consumidos por cada produto/serviço e em que quantidade
CREATE TABLE IF NOT EXISTS produto_estoque_vinculo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    estoque_item_id UUID NOT NULL REFERENCES estoque_itens(id) ON DELETE CASCADE,
    quantidade_usada NUMERIC(12,3) NOT NULL DEFAULT 1,
    observacoes TEXT,
    tenant_id UUID REFERENCES tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(produto_id, estoque_item_id)
);

-- Habilitar RLS
ALTER TABLE estoque_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto_estoque_vinculo ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para estoque_itens
CREATE POLICY "estoque_itens_select" ON estoque_itens FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "estoque_itens_insert" ON estoque_itens FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "estoque_itens_update" ON estoque_itens FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "estoque_itens_delete" ON estoque_itens FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Políticas RLS para estoque_movimentacoes
CREATE POLICY "estoque_movimentacoes_select" ON estoque_movimentacoes FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "estoque_movimentacoes_insert" ON estoque_movimentacoes FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "estoque_movimentacoes_update" ON estoque_movimentacoes FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "estoque_movimentacoes_delete" ON estoque_movimentacoes FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Políticas RLS para produto_estoque_vinculo
CREATE POLICY "produto_estoque_vinculo_select" ON produto_estoque_vinculo FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "produto_estoque_vinculo_insert" ON produto_estoque_vinculo FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "produto_estoque_vinculo_update" ON produto_estoque_vinculo FOR UPDATE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "produto_estoque_vinculo_delete" ON produto_estoque_vinculo FOR DELETE
    USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Índices para performance
CREATE INDEX IF NOT EXISTS estoque_itens_tenant_id_idx ON estoque_itens(tenant_id);
CREATE INDEX IF NOT EXISTS estoque_itens_categoria_idx ON estoque_itens(categoria);
CREATE INDEX IF NOT EXISTS estoque_itens_ativo_idx ON estoque_itens(ativo);
CREATE INDEX IF NOT EXISTS estoque_movimentacoes_tenant_id_idx ON estoque_movimentacoes(tenant_id);
CREATE INDEX IF NOT EXISTS estoque_movimentacoes_item_id_idx ON estoque_movimentacoes(estoque_item_id);
CREATE INDEX IF NOT EXISTS estoque_movimentacoes_data_idx ON estoque_movimentacoes(data_movimentacao);
CREATE INDEX IF NOT EXISTS produto_estoque_vinculo_tenant_id_idx ON produto_estoque_vinculo(tenant_id);
CREATE INDEX IF NOT EXISTS produto_estoque_vinculo_produto_id_idx ON produto_estoque_vinculo(produto_id);
CREATE INDEX IF NOT EXISTS produto_estoque_vinculo_item_id_idx ON produto_estoque_vinculo(estoque_item_id);
