import { supabase } from "../lib/supabase";

// --- Contas Bancárias ---

export const fetchContasBancarias = async (tenantId) => {
  const { data, error } = await supabase
    .from("contas_bancarias")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("nome", { ascending: true });
  if (error) throw error;
  return data;
};

export const createContaBancaria = async (payload) => {
  const { data, error } = await supabase
    .from("contas_bancarias")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateContaBancaria = async (id, payload) => {
  const { data, error } = await supabase
    .from("contas_bancarias")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteContaBancaria = async (id) => {
  const { error } = await supabase
    .from("contas_bancarias")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// --- Movimentos Bancários ---

export const fetchMovimentosBancarios = async (tenantId) => {
  const { data, error } = await supabase
    .from("movimentos_bancarios")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("data_movimento", { ascending: false });
  if (error) throw error;
  return data;
};

export const createMovimentoBancario = async (payload) => {
  const { data, error } = await supabase
    .from("movimentos_bancarios")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateMovimentoBancario = async (id, payload) => {
  const { data, error } = await supabase
    .from("movimentos_bancarios")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteMovimentoBancario = async (id) => {
  const { error } = await supabase
    .from("movimentos_bancarios")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// --- Conciliações Bancárias ---

export const fetchConciliacoesBancarias = async (tenantId) => {
  const { data, error } = await supabase
    .from("conciliacoes_bancarias")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("data_conciliacao", { ascending: false });
  if (error) throw error;
  return data;
};

export const createConciliacao = async (payload) => {
  const { data, error } = await supabase
    .from("conciliacoes_bancarias")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateConciliacao = async (id, payload) => {
  const { data, error } = await supabase
    .from("conciliacoes_bancarias")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteConciliacao = async (id) => {
  const { error } = await supabase
    .from("conciliacoes_bancarias")
    .delete()
    .eq("id", id);
  if (error) throw error;
};
