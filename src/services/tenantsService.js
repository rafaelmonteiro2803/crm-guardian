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
    p_cnpj: payload.cnpj || null,
    p_razao_social: payload.razao_social || null,
    p_inscricao_municipal: payload.inscricao_municipal || null,
    p_codigo_servico_cnae: payload.codigo_servico_cnae || null,
    p_cpf_cnpj_cliente: payload.cpf_cnpj_cliente || null,
    p_endereco_cep: payload.endereco_cep || null,
    p_endereco_logradouro: payload.endereco_logradouro || null,
    p_endereco_numero: payload.endereco_numero || null,
    p_endereco_complemento: payload.endereco_complemento || null,
    p_endereco_bairro: payload.endereco_bairro || null,
    p_endereco_cidade: payload.endereco_cidade || null,
    p_endereco_estado: payload.endereco_estado || null,
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
    p_cnpj: payload.cnpj || null,
    p_razao_social: payload.razao_social || null,
    p_inscricao_municipal: payload.inscricao_municipal || null,
    p_codigo_servico_cnae: payload.codigo_servico_cnae || null,
    p_cpf_cnpj_cliente: payload.cpf_cnpj_cliente || null,
    p_endereco_cep: payload.endereco_cep || null,
    p_endereco_logradouro: payload.endereco_logradouro || null,
    p_endereco_numero: payload.endereco_numero || null,
    p_endereco_complemento: payload.endereco_complemento || null,
    p_endereco_bairro: payload.endereco_bairro || null,
    p_endereco_cidade: payload.endereco_cidade || null,
    p_endereco_estado: payload.endereco_estado || null,
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
