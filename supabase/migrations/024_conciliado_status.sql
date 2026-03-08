-- =====================================================
-- Migration 024: Status "conciliado" para movimentos_bancarios e conciliacoes_bancarias
-- =====================================================

-- 1. Atualizar a constraint de status em movimentos_bancarios para incluir 'conciliado'
ALTER TABLE movimentos_bancarios
  DROP CONSTRAINT IF EXISTS movimentos_bancarios_status_check;

ALTER TABLE movimentos_bancarios
  ADD CONSTRAINT movimentos_bancarios_status_check
  CHECK (status IN ('aguardando_conciliacao', 'aguardando_confirmacao', 'confirmado', 'conciliado'));

-- 2. Atualizar a constraint de status em conciliacoes_bancarias para incluir 'conciliado'
ALTER TABLE conciliacoes_bancarias
  DROP CONSTRAINT IF EXISTS conciliacoes_bancarias_status_check;

ALTER TABLE conciliacoes_bancarias
  ADD CONSTRAINT conciliacoes_bancarias_status_check
  CHECK (status IN ('aguardando_confirmacao', 'confirmado', 'conciliado'));
