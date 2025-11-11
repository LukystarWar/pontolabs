# 🔧 Corrigir Erro: "Cannot coerce the result to a single JSON object"

## ❌ O Problema

Você criou o usuário no Supabase Auth, mas **não vinculou** ele na tabela `usuarios`.

## ✅ A Solução (3 minutos)

### PASSO 1: Pegar o UUID do usuário

1. Abra: https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz/auth/users
2. Encontre o usuário `superadmin@pontolabs.com.br`
3. Clique nele
4. **Copie o UUID** (está no topo, ex: `123e4567-e89b-12d3-a456-426614174000`)

### PASSO 2: Executar SQL para vincular

1. Vá em: **SQL Editor** no Supabase
2. Cole este SQL (substitua `<UUID_COPIADO>`):

```sql
-- Verificar se já existe (deve retornar vazio)
SELECT * FROM usuarios WHERE role = 'superadmin';

-- Inserir o superadmin
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_COPIADO>',
  NULL,
  'SuperAdmin PontoLabs',
  'superadmin@pontolabs.com.br',
  'superadmin'
);

-- Verificar se foi criado (agora deve retornar 1 linha)
SELECT * FROM usuarios WHERE role = 'superadmin';
```

3. Clique em **Run** (Ctrl+Enter)
4. Se aparecer ✅ sucesso, está pronto!

### PASSO 3: Testar Login

1. Volte para: `http://localhost/pontolabs/pages/login.html`
2. Login:
   - Email: `superadmin@pontolabs.com.br`
   - Senha: (a que você definiu)
3. **Deve funcionar agora!** 🎉

---

## 🔍 Diagnóstico Rápido

Execute este SQL para ver o que está acontecendo:

```sql
-- 1. Ver usuários no Auth (todos que podem fazer login)
-- Vá em: Authentication → Users

-- 2. Ver usuários vinculados na tabela (tem perfil completo)
SELECT
  u.id,
  u.nome,
  u.email,
  u.role,
  CASE
    WHEN u.empresa_id IS NULL THEN '✅ SuperAdmin'
    ELSE e.nome
  END as empresa
FROM usuarios u
LEFT JOIN empresas e ON e.id = u.empresa_id
ORDER BY u.criado_em DESC;
```

**O que deve aparecer:**
- Se **VAZIO** = Usuário não foi vinculado (execute PASSO 2)
- Se **TEM LINHA** com role 'superadmin' = Já está vinculado (deve funcionar)

---

## ⚠️ Erro Comum

### "Esqueci de copiar o UUID!"

**Solução:**
1. Vá em: Authentication → Users
2. Procure: superadmin@pontolabs.com.br
3. Clique no usuário
4. UUID está no topo da página

### "O SQL deu erro"

**Possíveis causas:**
1. UUID errado (copie novamente)
2. Email diferente (deve ser exatamente igual ao do Auth)
3. Usuário já existe (execute só o SELECT para verificar)

**Verificar:**
```sql
-- Ver se já existe
SELECT * FROM usuarios WHERE email = 'superadmin@pontolabs.com.br';

-- Se existir e tiver role errado, atualizar:
UPDATE usuarios
SET role = 'superadmin', empresa_id = NULL
WHERE email = 'superadmin@pontolabs.com.br';
```

---

## 🎯 Fluxo Correto (para próxima vez)

```
1. Criar usuário no Supabase Auth
   ↓
2. Copiar UUID
   ↓
3. Executar INSERT na tabela usuarios (com UUID)
   ↓
4. Fazer login
   ↓
5. ✅ Funciona!
```

**Você fez:** ✅ 1, ❌ 2, ❌ 3, ❌ 4

**Falta fazer:** Execute o PASSO 2 acima!

---

## 📝 SQL Completo Pronto

Copie tudo e execute:

```sql
-- ============================================
-- CRIAR SUPERADMIN - PONTOLABS
-- ============================================

-- 1. Verificar estado atual
SELECT 'Usuários SuperAdmin existentes:' as status;
SELECT * FROM usuarios WHERE role = 'superadmin';

-- 2. Inserir SuperAdmin
-- ⚠️ ATENÇÃO: Substitua '<SEU_UUID_AQUI>' pelo UUID do Supabase Auth!
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<SEU_UUID_AQUI>',
  NULL,
  'SuperAdmin PontoLabs',
  'superadmin@pontolabs.com.br',
  'superadmin'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'superadmin',
  empresa_id = NULL,
  nome = 'SuperAdmin PontoLabs',
  email = 'superadmin@pontolabs.com.br';

-- 3. Confirmar criação
SELECT 'SuperAdmin criado com sucesso!' as status;
SELECT * FROM usuarios WHERE role = 'superadmin';
```

---

## ✅ Checklist

- [ ] Criar usuário no Supabase Auth
- [ ] Copiar UUID do usuário
- [ ] Executar SQL INSERT com UUID
- [ ] Verificar com SELECT
- [ ] Fazer login
- [ ] ✅ Acessar painel SuperAdmin

---

## 🆘 Ainda não funcionou?

1. **Abra o Console do navegador** (F12)
2. **Veja a mensagem de erro** na aba Console
3. **Mande a mensagem completa** para análise

**Erro comum:**
- "Perfil não encontrado" = Não executou o INSERT
- "Cannot coerce..." = Não vinculou na tabela usuarios
- "Empresa inativa" = Bug (já corrigido, recarregue a página)

---

## 🎉 Quando Funcionar

Você verá:
1. Tela de login aceita credenciais
2. Redireciona para `/pages/superadmin/dashboard.html`
3. Dashboard mostra seu nome no topo
4. Estatísticas aparecem (0 empresas inicialmente)
5. Você pode criar empresas pelo botão!

**Pronto para usar!** 🚀
