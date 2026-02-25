import { supabase } from "../lib/supabase";

// --- Contas a Pagar ---

export const fetchContasPagar = async (tenantId) => {
  const { data, error } = await supabase
    .from("contas_pagar")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const createContaPagar = async (payload) => {
  const { data, error } = await supabase
    .from("contas_pagar")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateContaPagar = async (id, payload) => {
  const { data, error } = await supabase
    .from("contas_pagar")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteContaPagar = async (id) => {
  const { error } = await supabase.from("contas_pagar").delete().eq("id", id);
  if (error) throw error;
};

// --- Parcelas ---

export const fetchParcelasDeContas = async (tenantId) => {
  const { data, error } = await supabase
    .from("contas_pagar_parcelas")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("data_vencimento", { ascending: true });
  if (error) throw error;
  return data;
};

export const fetchParcelasByContaPagar = async (contaPagarId) => {
  const { data, error } = await supabase
    .from("contas_pagar_parcelas")
    .select("*")
    .eq("conta_pagar_id", contaPagarId)
    .order("numero_parcela", { ascending: true });
  if (error) throw error;
  return data;
};

export const createParcela = async (payload) => {
  const { data, error } = await supabase
    .from("contas_pagar_parcelas")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const createParcelas = async (payloads) => {
  const { data, error } = await supabase
    .from("contas_pagar_parcelas")
    .insert(payloads)
    .select();
  if (error) throw error;
  return data;
};

export const updateParcela = async (id, payload) => {
  const { data, error } = await supabase
    .from("contas_pagar_parcelas")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteParcela = async (id) => {
  const { error } = await supabase
    .from("contas_pagar_parcelas")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

export const deleteParcelasByContaPagar = async (contaPagarId) => {
  const { error } = await supabase
    .from("contas_pagar_parcelas")
    .delete()
    .eq("conta_pagar_id", contaPagarId);
  if (error) throw error;
};
