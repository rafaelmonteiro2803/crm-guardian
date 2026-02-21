-- =====================================================
-- Migration: Módulo de gestão de Tenants
-- Adiciona campos logo_url e slogan à tabela tenants
-- Cria funções RPC para CRUD de tenants (acesso apenas por owners)
-- Configura bucket de storage para logos
-- =====================================================

-- 1. Adicionar colunas logo_url e slogan à tabela tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS slogan TEXT;

-- 2. Criar bucket de storage para logos de tenants (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tenant-logos',
  'tenant-logos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de storage para logos
-- Leitura pública (bucket é público)
DROP POLICY IF EXISTS "tenant_logos_public_read" ON storage.objects;
CREATE POLICY "tenant_logos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'tenant-logos');

-- Upload apenas para owners
DROP POLICY IF EXISTS "tenant_logos_owner_insert" ON storage.objects;
CREATE POLICY "tenant_logos_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'tenant-logos' AND
    EXISTS (
      SELECT 1 FROM tenant_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Atualização apenas para owners
DROP POLICY IF EXISTS "tenant_logos_owner_update" ON storage.objects;
CREATE POLICY "tenant_logos_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'tenant-logos' AND
    EXISTS (
      SELECT 1 FROM tenant_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Exclusão apenas para owners
DROP POLICY IF EXISTS "tenant_logos_owner_delete" ON storage.objects;
CREATE POLICY "tenant_logos_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'tenant-logos' AND
    EXISTS (
      SELECT 1 FROM tenant_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- 4. RPC: Listar todos os tenants (somente owners)
CREATE OR REPLACE FUNCTION public.get_tenants_for_owner()
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
  SELECT t.id, t.nome, t.slogan, t.cor, t.logo_url, t.created_at
  FROM tenants t
  ORDER BY t.nome;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_tenants_for_owner() TO authenticated;

-- 5. RPC: Criar tenant (somente owners)
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
  RETURNING id, nome, slogan, cor, logo_url, created_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_tenant(TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- 6. RPC: Atualizar tenant (somente owners)
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
    nome = p_nome,
    slogan = p_slogan,
    cor = p_cor,
    logo_url = p_logo_url
  WHERE id = p_id
  RETURNING id, nome, slogan, cor, logo_url, created_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_tenant(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- 7. RPC: Excluir tenant (somente owners)
CREATE OR REPLACE FUNCTION public.delete_tenant(p_id UUID)
RETURNS VOID
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

  DELETE FROM tenants WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_tenant(UUID) TO authenticated;
