import { supabase } from "../lib/supabase";

// --- Itens de Estoque ---

export const fetchEstoqueItens = async (tenantId) => {
  const { data, error } = await supabase
    .from("estoque_itens")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("nome", { ascending: true });
  if (error) throw error;
  return data;
};

export const createEstoqueItem = async (payload) => {
  const { data, error } = await supabase
    .from("estoque_itens")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateEstoqueItem = async (id, payload) => {
  const { data, error } = await supabase
    .from("estoque_itens")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteEstoqueItem = async (id) => {
  const { error } = await supabase.from("estoque_itens").delete().eq("id", id);
  if (error) throw error;
};

// --- Movimentações ---

export const fetchEstoqueMovimentacoes = async (tenantId) => {
  const { data, error } = await supabase
    .from("estoque_movimentacoes")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("data_movimentacao", { ascending: false });
  if (error) throw error;
  return data;
};

export const createMovimentacao = async (payload) => {
  const { data, error } = await supabase
    .from("estoque_movimentacoes")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteMovimentacao = async (id) => {
  const { error } = await supabase
    .from("estoque_movimentacoes")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// --- Vínculos Produto-Estoque ---

export const fetchProdutoEstoqueVinculos = async (tenantId) => {
  const { data, error } = await supabase
    .from("produto_estoque_vinculo")
    .select("*")
    .eq("tenant_id", tenantId);
  if (error) throw error;
  return data;
};

export const createVinculo = async (payload) => {
  const { data, error } = await supabase
    .from("produto_estoque_vinculo")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteVinculo = async (id) => {
  const { error } = await supabase
    .from("produto_estoque_vinculo")
    .delete()
    .eq("id", id);
  if (error) throw error;
};
