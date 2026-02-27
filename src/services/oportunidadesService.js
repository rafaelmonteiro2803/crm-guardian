import { supabase } from "../lib/supabase";

export const fetchOportunidades = async (tenantId) => {
  const { data } = await supabase
    .from("oportunidades")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  return data || [];
};

export const createOportunidade = async (payload) => {
  const { data } = await supabase.from("oportunidades").insert([payload]).select();
  return data?.[0] || null;
};

export const updateOportunidade = async (id, payload) => {
  const { data } = await supabase.from("oportunidades").update(payload).eq("id", id).select();
  return data?.[0] || null;
};

export const deleteOportunidade = async (id) => {
  await supabase.from("oportunidades").delete().eq("id", id);
};
