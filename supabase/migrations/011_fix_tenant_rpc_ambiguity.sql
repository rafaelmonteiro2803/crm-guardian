-- =====================================================
-- Migration: Corrige ambiguidade de coluna nas funções
-- create_tenant e update_tenant (erro 42702)
-- =====================================================

-- Corrige create_tenant: qualifica colunas no RETURNING
CREATE OR REPLACE FUNCTION public.create_tenant(
  p_nome TEXT,
  p_slogan TEXT DEFAULT NULL,
  p_cor TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  slogan TEXT,
  cor TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM tenant_members
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: perfil owner obrigatório';
  END IF;

  RETURN QUERY
  INSERT INTO tenants (nome, slogan, cor, logo_url)
  VALUES (p_nome, p_slogan, p_cor, p_logo_url)
  RETURNING
    tenants.id,
    tenants.nome,
    tenants.slogan,
    tenants.cor,
    tenants.logo_url,
    tenants.created_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_tenant(TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Corrige update_tenant: qualifica colunas no RETURNING
CREATE OR REPLACE FUNCTION public.update_tenant(
  p_id UUID,
  p_nome TEXT,
  p_slogan TEXT DEFAULT NULL,
  p_cor TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  slogan TEXT,
  cor TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    nome     = p_nome,
    slogan   = p_slogan,
    cor      = p_cor,
    logo_url = p_logo_url
  WHERE tenants.id = p_id
  RETURNING
    tenants.id,
    tenants.nome,
    tenants.slogan,
    tenants.cor,
    tenants.logo_url,
    tenants.created_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_tenant(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
