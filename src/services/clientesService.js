import { supabase } from "../lib/supabase";

export const fetchClientes = async (tenantId) => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("data_cadastro", { ascending: false });
  if (error) throw error;
  return data;
};

export const createCliente = async (payload) => {
  const { data, error } = await supabase
    .from("clientes")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateCliente = async (id, payload) => {
  const { data, error } = await supabase
    .from("clientes")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteCliente = async (id) => {
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);
  if (error) throw error;
};
