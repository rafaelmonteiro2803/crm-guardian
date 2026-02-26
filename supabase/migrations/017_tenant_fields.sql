-- =====================================================
-- Migration: Campos adicionais para Tenants
-- Adiciona CNPJ, Razão Social, Inscrição Municipal,
-- Código de Serviço (CNAE), CPF/CNPJ do cliente e endereço
-- =====================================================

-- 1. Adicionar colunas fiscais e de endereço à tabela tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS cnpj TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS razao_social TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS inscricao_municipal TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS codigo_servico_cnae TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS cpf_cnpj_cliente TEXT;

-- Endereço
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS endereco_cep TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS endereco_logradouro TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS endereco_numero TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS endereco_complemento TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS endereco_bairro TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS endereco_cidade TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS endereco_estado TEXT;

-- 2. Remover versões antigas das funções (retorno incompatível)
--    Usando bloco DO com tag distinta para não conflitar com $$ do runner
DO $drop_old_funcs$
BEGIN
  DROP FUNCTION IF EXISTS public.get_tenants_for_owner() CASCADE;
  DROP FUNCTION IF EXISTS public.create_tenant(TEXT,TEXT,TEXT,TEXT) CASCADE;
  DROP FUNCTION IF EXISTS public.update_tenant(UUID,TEXT,TEXT,TEXT,TEXT) CASCADE;
END $drop_old_funcs$;

-- 3. RPC: Listar todos os tenants com novos campos (somente owners)
CREATE OR REPLACE FUNCTION public.get_tenants_for_owner()
RETURNS TABLE (
  id UUID,
  nome TEXT,
  slogan TEXT,
  cor TEXT,
  logo_url TEXT,
  cnpj TEXT,
  razao_social TEXT,
  inscricao_municipal TEXT,
  codigo_servico_cnae TEXT,
  cpf_cnpj_cliente TEXT,
  endereco_cep TEXT,
  endereco_logradouro TEXT,
  endereco_numero TEXT,
  endereco_complemento TEXT,
  endereco_bairro TEXT,
  endereco_cidade TEXT,
  endereco_estado TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $get_tenants_fn$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  RETURN QUERY
  SELECT
    t.id, t.nome, t.slogan, t.cor, t.logo_url,
    t.cnpj, t.razao_social, t.inscricao_municipal, t.codigo_servico_cnae, t.cpf_cnpj_cliente,
    t.endereco_cep, t.endereco_logradouro, t.endereco_numero, t.endereco_complemento,
    t.endereco_bairro, t.endereco_cidade, t.endereco_estado,
    t.created_at
  FROM tenants t
  ORDER BY t.nome;
END;
$get_tenants_fn$;

GRANT EXECUTE ON FUNCTION public.get_tenants_for_owner() TO authenticated;

-- 4. RPC: Criar tenant com novos campos (somente owners)
CREATE OR REPLACE FUNCTION public.create_tenant(
  p_nome TEXT,
  p_slogan TEXT DEFAULT NULL,
  p_cor TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL,
  p_cnpj TEXT DEFAULT NULL,
  p_razao_social TEXT DEFAULT NULL,
  p_inscricao_municipal TEXT DEFAULT NULL,
  p_codigo_servico_cnae TEXT DEFAULT NULL,
  p_cpf_cnpj_cliente TEXT DEFAULT NULL,
  p_endereco_cep TEXT DEFAULT NULL,
  p_endereco_logradouro TEXT DEFAULT NULL,
  p_endereco_numero TEXT DEFAULT NULL,
  p_endereco_complemento TEXT DEFAULT NULL,
  p_endereco_bairro TEXT DEFAULT NULL,
  p_endereco_cidade TEXT DEFAULT NULL,
  p_endereco_estado TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  slogan TEXT,
  cor TEXT,
  logo_url TEXT,
  cnpj TEXT,
  razao_social TEXT,
  inscricao_municipal TEXT,
  codigo_servico_cnae TEXT,
  cpf_cnpj_cliente TEXT,
  endereco_cep TEXT,
  endereco_logradouro TEXT,
  endereco_numero TEXT,
  endereco_complemento TEXT,
  endereco_bairro TEXT,
  endereco_cidade TEXT,
  endereco_estado TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $create_tenant_fn$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  RETURN QUERY
  INSERT INTO tenants (
    nome, slogan, cor, logo_url,
    cnpj, razao_social, inscricao_municipal, codigo_servico_cnae, cpf_cnpj_cliente,
    endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento,
    endereco_bairro, endereco_cidade, endereco_estado
  )
  VALUES (
    p_nome, p_slogan, p_cor, p_logo_url,
    p_cnpj, p_razao_social, p_inscricao_municipal, p_codigo_servico_cnae, p_cpf_cnpj_cliente,
    p_endereco_cep, p_endereco_logradouro, p_endereco_numero, p_endereco_complemento,
    p_endereco_bairro, p_endereco_cidade, p_endereco_estado
  )
  RETURNING
    id, nome, slogan, cor, logo_url,
    cnpj, razao_social, inscricao_municipal, codigo_servico_cnae, cpf_cnpj_cliente,
    endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento,
    endereco_bairro, endereco_cidade, endereco_estado,
    created_at;
END;
$create_tenant_fn$;

GRANT EXECUTE ON FUNCTION public.create_tenant(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT) TO authenticated;

-- 5. RPC: Atualizar tenant com novos campos (somente owners)
CREATE OR REPLACE FUNCTION public.update_tenant(
  p_id UUID,
  p_nome TEXT,
  p_slogan TEXT DEFAULT NULL,
  p_cor TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL,
  p_cnpj TEXT DEFAULT NULL,
  p_razao_social TEXT DEFAULT NULL,
  p_inscricao_municipal TEXT DEFAULT NULL,
  p_codigo_servico_cnae TEXT DEFAULT NULL,
  p_cpf_cnpj_cliente TEXT DEFAULT NULL,
  p_endereco_cep TEXT DEFAULT NULL,
  p_endereco_logradouro TEXT DEFAULT NULL,
  p_endereco_numero TEXT DEFAULT NULL,
  p_endereco_complemento TEXT DEFAULT NULL,
  p_endereco_bairro TEXT DEFAULT NULL,
  p_endereco_cidade TEXT DEFAULT NULL,
  p_endereco_estado TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  slogan TEXT,
  cor TEXT,
  logo_url TEXT,
  cnpj TEXT,
  razao_social TEXT,
  inscricao_municipal TEXT,
  codigo_servico_cnae TEXT,
  cpf_cnpj_cliente TEXT,
  endereco_cep TEXT,
  endereco_logradouro TEXT,
  endereco_numero TEXT,
  endereco_complemento TEXT,
  endereco_bairro TEXT,
  endereco_cidade TEXT,
  endereco_estado TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $update_tenant_fn$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  RETURN QUERY
  UPDATE tenants
  SET
    nome = p_nome,
    slogan = p_slogan,
    cor = p_cor,
    logo_url = p_logo_url,
    cnpj = p_cnpj,
    razao_social = p_razao_social,
    inscricao_municipal = p_inscricao_municipal,
    codigo_servico_cnae = p_codigo_servico_cnae,
    cpf_cnpj_cliente = p_cpf_cnpj_cliente,
    endereco_cep = p_endereco_cep,
    endereco_logradouro = p_endereco_logradouro,
    endereco_numero = p_endereco_numero,
    endereco_complemento = p_endereco_complemento,
    endereco_bairro = p_endereco_bairro,
    endereco_cidade = p_endereco_cidade,
    endereco_estado = p_endereco_estado
  WHERE id = p_id
  RETURNING
    id, nome, slogan, cor, logo_url,
    cnpj, razao_social, inscricao_municipal, codigo_servico_cnae, cpf_cnpj_cliente,
    endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento,
    endereco_bairro, endereco_cidade, endereco_estado,
    created_at;
END;
$update_tenant_fn$;

GRANT EXECUTE ON FUNCTION public.update_tenant(UUID,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT) TO authenticated;
