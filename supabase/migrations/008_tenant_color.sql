-- =====================================================
-- Migration: Adicionar coluna de cor ao tenant
-- =====================================================

-- Adiciona coluna de cor customizada ao tenant
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS cor TEXT;

-- Define a cor da Sala Isis
UPDATE tenants SET cor = 'rgb(253, 248, 239)' WHERE nome = 'Sala Isis';
