-- =====================================================
-- Migration: Adicionar campo CPF na tabela clientes
-- =====================================================

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cpf TEXT;
