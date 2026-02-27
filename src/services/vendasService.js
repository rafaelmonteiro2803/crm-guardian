import { supabase } from "../lib/supabase";

export const fetchVendas = async (tenantId) => {
  const { data } = await supabase
    .from("vendas")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("data_venda", { ascending: false });
  return data || [];
};

export const createVenda = async (payload) => {
  const { data } = await supabase.from("vendas").insert([payload]).select();
  return data?.[0] || null;
};

export const updateVenda = async (id, payload) => {
  const { data } = await supabase.from("vendas").update(payload).eq("id", id).select();
  return data?.[0] || null;
};

export const deleteVenda = async (id) => {
  await supabase.from("vendas").delete().eq("id", id);
};

export const fetchTitulos = async (tenantId) => {
  const { data } = await supabase
    .from("titulos")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("data_vencimento", { ascending: true });
  return data || [];
};

export const createTitulo = async (payload) => {
  const { data } = await supabase.from("titulos").insert([payload]).select();
  return data?.[0] || null;
};

export const updateTitulo = async (id, payload) => {
  const { data } = await supabase.from("titulos").update(payload).eq("id", id).select();
  return data?.[0] || null;
};

export const deleteTitulo = async (id) => {
  await supabase.from("titulos").delete().eq("id", id);
};

export const createOrdemServico = async (payload) => {
  const { data } = await supabase.from("ordens_servico").insert([payload]).select();
  return data?.[0] || null;
};
