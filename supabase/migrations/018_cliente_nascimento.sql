-- =====================================================
-- Migration: Campo data_nascimento no módulo de clientes
-- =====================================================

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS data_nascimento DATE;
