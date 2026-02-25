import { supabase } from "../lib/supabase";

export const fetchCentrosCusto = async (tenantId) => {
  const { data, error } = await supabase
    .from("centros_custo")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("nome", { ascending: true });
  if (error) throw error;
  return data;
};

export const createCentroCusto = async (payload) => {
  const { data, error } = await supabase
    .from("centros_custo")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateCentroCusto = async (id, payload) => {
  const { data, error } = await supabase
    .from("centros_custo")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteCentroCusto = async (id) => {
  const { error } = await supabase.from("centros_custo").delete().eq("id", id);
  if (error) throw error;
};
