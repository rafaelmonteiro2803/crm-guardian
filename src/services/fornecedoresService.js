import { supabase } from "../lib/supabase";

export const fetchFornecedores = async (tenantId) => {
  const { data, error } = await supabase
    .from("fornecedores")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("nome", { ascending: true });
  if (error) throw error;
  return data;
};

export const createFornecedor = async (payload) => {
  const { data, error } = await supabase
    .from("fornecedores")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateFornecedor = async (id, payload) => {
  const { data, error } = await supabase
    .from("fornecedores")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteFornecedor = async (id) => {
  const { error } = await supabase.from("fornecedores").delete().eq("id", id);
  if (error) throw error;
};
