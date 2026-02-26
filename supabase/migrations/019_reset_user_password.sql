-- =====================================================
-- Migration: Redefinir senha do usuário miguel_ricardo@uol.com.br
-- =====================================================

UPDATE auth.users
SET encrypted_password = crypt('123456', gen_salt('bf'))
WHERE email = 'miguel_ricardo@uol.com.br';
