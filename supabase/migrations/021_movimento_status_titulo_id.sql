-- =====================================================
-- Migration 021: Status "Aguardando Conciliação" e titulo_id em movimentos_bancarios
-- =====================================================

-- 1. Adicionar coluna titulo_id em movimentos_bancarios
ALTER TABLE movimentos_bancarios
  ADD COLUMN IF NOT EXISTS titulo_id UUID
    REFERENCES titulos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS movimentos_bancarios_titulo_id_idx
  ON movimentos_bancarios(titulo_id);

-- 2. Atualizar a constraint de status para incluir 'aguardando_conciliacao'
ALTER TABLE movimentos_bancarios
  DROP CONSTRAINT IF EXISTS movimentos_bancarios_status_check;

ALTER TABLE movimentos_bancarios
  ADD CONSTRAINT movimentos_bancarios_status_check
  CHECK (status IN ('aguardando_confirmacao', 'confirmado', 'aguardando_conciliacao'));

-- 3. Alterar o DEFAULT do status para 'aguardando_conciliacao'
ALTER TABLE movimentos_bancarios
  ALTER COLUMN status SET DEFAULT 'aguardando_conciliacao';
