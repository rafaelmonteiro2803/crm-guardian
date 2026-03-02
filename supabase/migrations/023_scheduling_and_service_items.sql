-- =====================================================
-- Migration: Agendamento de Atendimento e Seleção de Itens na OS
-- =====================================================

-- Adiciona data de agendamento do atendimento
ALTER TABLE ordens_servico
    ADD COLUMN IF NOT EXISTS data_agendamento TIMESTAMPTZ;

-- Adiciona itens selecionados/atribuídos ao técnico na OS
-- Armazena os índices ou ids dos itens que foram selecionados no encaminhamento
ALTER TABLE ordens_servico
    ADD COLUMN IF NOT EXISTS itens_selecionados JSONB DEFAULT '[]';

-- Índice para facilitar consultas de OS agendadas
CREATE INDEX IF NOT EXISTS ordens_servico_data_agendamento_idx ON ordens_servico(data_agendamento);
