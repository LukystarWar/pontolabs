-- ============================================
-- DIAGNÓSTICO SUPERADMIN - PONTOLABS
-- ============================================

-- PASSO 1: Verificar se o usuário existe na tabela usuarios
SELECT
  id,
  nome,
  email,
  role,
  empresa_id,
  criado_em
FROM usuarios
WHERE role = 'superadmin';

-- Se retornar VAZIO, você precisa vincular o usuário!
-- Se retornar dados, o superadmin já existe.

-- ============================================

-- PASSO 2: Ver todos os usuários cadastrados
SELECT
  u.id,
  u.nome,
  u.email,
  u.role,
  CASE
    WHEN u.empresa_id IS NULL THEN '(Sem empresa - SuperAdmin)'
    ELSE e.nome
  END as empresa
FROM usuarios u
LEFT JOIN empresas e ON e.id = u.empresa_id
ORDER BY u.criado_em DESC;

-- ============================================

-- PASSO 3: Se o superadmin NÃO existir, execute este SQL:
-- (Substitua '<UUID_DO_AUTH>' pelo UUID do Supabase Auth)

/*
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_AUTH>',
  NULL,
  'SuperAdmin PontoLabs',
  'superadmin@pontolabs.com.br',
  'superadmin'
);
*/

-- ============================================

-- PASSO 4: Verificar novamente após inserir
SELECT * FROM usuarios WHERE role = 'superadmin';

-- ✅ Se retornar dados, está pronto!
-- ✅ Agora pode fazer login
