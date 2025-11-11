-- ============================================
-- CRIAR SUPERADMIN - PONTOLABS
-- ============================================

-- PASSO 1: Criar usuário no Supabase Auth
-- Vá em: Authentication → Users → Add User
-- Email: superadmin@pontolabs.com.br
-- Password: Super@2025
-- ✅ Auto Confirm User
-- COPIE O UUID DO USUÁRIO!

-- PASSO 2: Execute este SQL substituindo o UUID
-- (Substitua '<UUID_DO_AUTH>' pelo UUID copiado)

INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_AUTH>',
  NULL,  -- SuperAdmin não tem empresa
  'SuperAdmin PontoLabs',
  'superadmin@pontolabs.com.br',
  'superadmin'
);

-- PASSO 3: Verifique se foi criado corretamente
SELECT * FROM usuarios WHERE role = 'superadmin';

-- ✅ PRONTO!
-- Agora você pode fazer login:
-- URL: /pages/login.html
-- Email: superadmin@pontolabs.com.br
-- Senha: Super@2025
