import { supabase } from "../lib/supabase";

export const fetchTecnicos = async (tenantId) => {
  const { data } = await supabase.from("tecnicos").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
  return data || [];
};

export const createTecnico = async (payload) => {
  const { data } = await supabase.from("tecnicos").insert([payload]).select();
  return data?.[0] || null;
};

export const updateTecnico = async (id, payload) => {
  const { data } = await supabase.from("tecnicos").update(payload).eq("id", id).select();
  return data?.[0] || null;
};

export const deleteTecnico = async (id) => {
  await supabase.from("tecnicos").delete().eq("id", id);
};

export const fetchComissoes = async (tenantId) => {
  const { data } = await supabase.from("comissoes").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
  return data || [];
};

export const updateComissao = async (id, payload) => {
  const { data } = await supabase.from("comissoes").update(payload).eq("id", id).select();
  return data?.[0] || null;
};

export const deleteComissao = async (id) => {
  await supabase.from("comissoes").delete().eq("id", id);
};
