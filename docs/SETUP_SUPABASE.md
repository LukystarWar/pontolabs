# 🔧 Setup Supabase - Passo a Passo

## 1️⃣ Executar SQL Schema

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz
2. No menu lateral, clique em **SQL Editor**
3. Clique em **+ New Query**
4. Cole o conteúdo do arquivo `database/schema.sql`
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Aguarde a execução ✅

**Resultado esperado:**
- 5 tabelas criadas: `empresas`, `usuarios`, `funcionarios`, `terminais`, `pontos`
- Índices criados
- Trigger de proteção nos pontos
- RLS policies aplicadas
- 1 empresa de teste inserida

## 2️⃣ Criar Usuários no Supabase Auth

### Criar Admin

1. Vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - Email: `admin@pontolabs.com.br`
   - Password: `Admin@2025` (ou outra senha segura)
   - Auto Confirm User: ✅ (marcar)
4. Clique em **Create user**
5. **IMPORTANTE:** Copie o UUID do usuário criado (coluna `id`)

### Vincular Admin à Empresa

1. Volte no **SQL Editor**
2. Execute este SQL (substitua os UUIDs):

```sql
-- Buscar UUID da empresa
SELECT id, nome FROM empresas;

-- Inserir admin na tabela usuarios
-- Substitua:
-- <UUID_DO_AUTH> = UUID que você copiou do Authentication
-- <UUID_DA_EMPRESA> = UUID que apareceu na query acima

INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_AUTH>',
  '<UUID_DA_EMPRESA>',
  'Admin Teste',
  'admin@pontolabs.com.br',
  'admin'
);
```

## 3️⃣ Criar Terminal

### No Auth:

1. **Authentication** → **Users** → **Add user**
2. Email: `terminal@pontolabs.com.br`
3. Password: `Terminal@2025`
4. Auto Confirm: ✅
5. Copie o UUID

### Vincular Terminal:

```sql
-- Inserir na tabela usuarios
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_TERMINAL_AUTH>',
  '<UUID_DA_EMPRESA>',
  'Terminal Principal',
  'terminal@pontolabs.com.br',
  'terminal'
);

-- Criar terminal
INSERT INTO terminais (empresa_id, usuario_id, nome, localizacao, ativo, chave_secreta)
VALUES (
  '<UUID_DA_EMPRESA>',
  '<UUID_DO_TERMINAL_AUTH>',
  'Terminal Recepção',
  'Recepção - 1º Andar',
  true,
  'pontolabs-secret-key-2025-change-in-production'
);
```

## 4️⃣ Criar Funcionário

### No Auth:

1. **Authentication** → **Users** → **Add user**
2. Email: `funcionario@pontolabs.com.br`
3. Password: `Func@2025`
4. Auto Confirm: ✅
5. Copie o UUID

### Vincular Funcionário:

```sql
-- Inserir na tabela usuarios
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_FUNCIONARIO_AUTH>',
  '<UUID_DA_EMPRESA>',
  'João Silva',
  'funcionario@pontolabs.com.br',
  'funcionario'
);

-- Criar funcionário
INSERT INTO funcionarios (empresa_id, usuario_id, nome, cargo, turno, ativo)
VALUES (
  '<UUID_DA_EMPRESA>',
  '<UUID_DO_FUNCIONARIO_AUTH>',
  'João Silva',
  'Operador de Produção',
  'Integral',
  true
);
```

## 5️⃣ Verificar Configuração

Execute para ver todos os dados:

```sql
-- Ver empresa
SELECT * FROM empresas;

-- Ver usuários
SELECT u.*, e.nome as empresa_nome
FROM usuarios u
LEFT JOIN empresas e ON e.id = u.empresa_id;

-- Ver funcionários
SELECT * FROM funcionarios;

-- Ver terminais
SELECT * FROM terminais;
```

## 6️⃣ Pegar Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL:** `https://pfbynyflbtdlnozqtgxz.supabase.co`
   - **anon public:** (já está no config.js)
   - **service_role:** (cole no `.env` para Netlify)

## ✅ Pronto!

Agora você pode:
- Fazer login como admin em: `https://seu-site/pages/login.html`
- Fazer login como terminal
- Fazer login como funcionário
- Testar o sistema completo!

### Credenciais de Teste:

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@pontolabs.com.br | Admin@2025 |
| Terminal | terminal@pontolabs.com.br | Terminal@2025 |
| Funcionário | funcionario@pontolabs.com.br | Func@2025 |

---

🎉 **Setup completo!**
