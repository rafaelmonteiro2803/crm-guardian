import { supabase } from "../lib/supabase";

export const fetchAllTenants = async () => {
  const { data, error } = await supabase.rpc("get_tenants_for_owner");
  if (error) throw error;
  return data;
};

export const createTenant = async (payload) => {
  const { data, error } = await supabase.rpc("create_tenant", {
    p_nome: payload.nome,
    p_slogan: payload.slogan || null,
    p_cor: payload.cor || null,
    p_logo_url: payload.logo_url || null,
  });
  if (error) throw error;
  return data[0];
};

export const updateTenant = async (id, payload) => {
  const { data, error } = await supabase.rpc("update_tenant", {
    p_id: id,
    p_nome: payload.nome,
    p_slogan: payload.slogan || null,
    p_cor: payload.cor || null,
    p_logo_url: payload.logo_url || null,
  });
  if (error) throw error;
  return data[0];
};

export const deleteTenant = async (id) => {
  const { error } = await supabase.rpc("delete_tenant", { p_id: id });
  if (error) throw error;
};

export const uploadTenantLogo = async (file, tenantId) => {
  const ext = file.name.split(".").pop();
  const path = `${tenantId}/logo.${ext}`;

  const { error } = await supabase.storage
    .from("tenant-logos")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from("tenant-logos")
    .getPublicUrl(path);

  return data.publicUrl;
};
