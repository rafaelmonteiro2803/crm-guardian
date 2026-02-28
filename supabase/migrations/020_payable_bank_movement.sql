-- =====================================================
-- Migration 020: Movimento bancário pendente ao criar conta a pagar
--                + Conciliação com tipo PAGO/RECEBIDO e status
-- =====================================================

-- -------------------------------------------------------
-- 1. contas_pagar_parcelas: adicionar status aguardando_pagamento
-- -------------------------------------------------------
ALTER TABLE contas_pagar_parcelas
  DROP CONSTRAINT IF EXISTS contas_pagar_parcelas_status_check;

ALTER TABLE contas_pagar_parcelas
  ADD CONSTRAINT contas_pagar_parcelas_status_check
  CHECK (status IN ('aguardando_pagamento', 'em_aberto', 'pago', 'vencido', 'cancelado'));

-- -------------------------------------------------------
-- 2. movimentos_bancarios: tornar conta_id e fonte_pagamento nullable
--    e adicionar coluna status + conta_pagar_parcela_id
-- -------------------------------------------------------
ALTER TABLE movimentos_bancarios
  ALTER COLUMN conta_id DROP NOT NULL;

ALTER TABLE movimentos_bancarios
  ALTER COLUMN fonte_pagamento DROP NOT NULL;

ALTER TABLE movimentos_bancarios
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'aprovado'
    CHECK (status IN ('em_aprovacao', 'aprovado'));

ALTER TABLE movimentos_bancarios
  ADD COLUMN IF NOT EXISTS conta_pagar_parcela_id UUID
    REFERENCES contas_pagar_parcelas(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS movimentos_bancarios_status_idx
  ON movimentos_bancarios(status);

CREATE INDEX IF NOT EXISTS movimentos_bancarios_parcela_id_idx
  ON movimentos_bancarios(conta_pagar_parcela_id);

-- -------------------------------------------------------
-- 3. conciliacoes_bancarias: tornar titulo_id e movimento_bancario_id nullable,
--    remover UNIQUE antigo, e adicionar tipo, status, conta_pagar_parcela_id
-- -------------------------------------------------------
ALTER TABLE conciliacoes_bancarias
  ALTER COLUMN titulo_id DROP NOT NULL;

ALTER TABLE conciliacoes_bancarias
  ALTER COLUMN movimento_bancario_id DROP NOT NULL;

-- Remove a constraint UNIQUE antiga (titulo_id, movimento_bancario_id)
ALTER TABLE conciliacoes_bancarias
  DROP CONSTRAINT IF EXISTS conciliacoes_bancarias_titulo_id_movimento_bancario_id_key;

ALTER TABLE conciliacoes_bancarias
  ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'recebido'
    CHECK (tipo IN ('pago', 'recebido'));

ALTER TABLE conciliacoes_bancarias
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'aguardando_confirmacao'
    CHECK (status IN ('aguardando_confirmacao', 'confirmado'));

ALTER TABLE conciliacoes_bancarias
  ADD COLUMN IF NOT EXISTS conta_pagar_parcela_id UUID
    REFERENCES contas_pagar_parcelas(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS conciliacoes_tipo_idx
  ON conciliacoes_bancarias(tipo);

CREATE INDEX IF NOT EXISTS conciliacoes_status_idx
  ON conciliacoes_bancarias(status);

CREATE INDEX IF NOT EXISTS conciliacoes_parcela_id_idx
  ON conciliacoes_bancarias(conta_pagar_parcela_id);
