-- =====================================================
-- Migration: Adicionar campos Lote, Validade e Fornecedor (FK) ao estoque
-- =====================================================

-- Adicionar campo Lote
ALTER TABLE estoque_itens
  ADD COLUMN IF NOT EXISTS lote TEXT;

-- Adicionar campo Validade
ALTER TABLE estoque_itens
  ADD COLUMN IF NOT EXISTS validade DATE;

-- Adicionar referência ao fornecedor cadastrado
ALTER TABLE estoque_itens
  ADD COLUMN IF NOT EXISTS fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL;

-- Índice para busca por validade
CREATE INDEX IF NOT EXISTS estoque_itens_validade_idx ON estoque_itens(validade);

-- Índice para busca por fornecedor_id
CREATE INDEX IF NOT EXISTS estoque_itens_fornecedor_id_idx ON estoque_itens(fornecedor_id);
