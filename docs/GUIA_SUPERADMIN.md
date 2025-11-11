# 🔐 Guia do SuperAdmin - PontoLabs

## 📋 Índice
1. [Primeiro Acesso](#primeiro-acesso)
2. [Como Usar o Painel](#como-usar-o-painel)
3. [Criar Nova Empresa](#criar-nova-empresa)
4. [Adicionar Admin para Empresa](#adicionar-admin-para-empresa)
5. [Gerenciar Empresas](#gerenciar-empresas)
6. [Visualizar Dados do Sistema](#visualizar-dados-do-sistema)

---

## 🚀 Primeiro Acesso

### 1. Criar Usuário SuperAdmin no Supabase

1. Acesse: https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz
2. Vá em **Authentication** → **Users**
3. Clique em **Add user** → **Create new user**
4. Preencha:
   - Email: `superadmin@pontolabs.com.br`
   - Password: `Super@2025` (ou uma senha segura)
   - ✅ Marque "Auto Confirm User"
5. Clique em **Create user**
6. **IMPORTANTE:** Copie o UUID do usuário criado

### 2. Vincular como SuperAdmin

1. Vá em **SQL Editor**
2. Execute este SQL (substitua `<UUID_DO_AUTH>` pelo UUID copiado):

```sql
-- Inserir superadmin na tabela usuarios
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_AUTH>',
  NULL,  -- SuperAdmin não pertence a nenhuma empresa
  'SuperAdmin PontoLabs',
  'superadmin@pontolabs.com.br',
  'superadmin'
);
```

### 3. Fazer Login

1. Acesse: `http://localhost/pontolabs/pages/login.html`
2. Email: `superadmin@pontolabs.com.br`
3. Senha: `Super@2025`
4. Você será redirecionado para o Dashboard SuperAdmin! 🎉

---

## 🎯 Como Usar o Painel

O painel SuperAdmin tem 4 seções:

### 📊 Dashboard
- Visão geral de todas as empresas
- Estatísticas globais (empresas, usuários, funcionários, terminais, pontos)
- Empresas recentes
- Atividade em tempo real

### 🏢 Empresas
- **CRUD completo** de empresas
- Ver detalhes de cada empresa (usuários, funcionários, terminais, pontos)
- Editar limites e planos
- Ativar/desativar empresas

### 👥 Usuários
- Lista de TODOS os usuários do sistema
- Filtrar por tipo (superadmin, admin, funcionário, terminal)
- Filtrar por empresa
- Ver detalhes de cada usuário

### ⚙️ Sistema
- Informações técnicas do sistema
- Estatísticas do banco de dados
- Guia rápido de uso
- Comandos SQL úteis
- Links para Supabase Dashboard

---

## 🏢 Criar Nova Empresa

### Passo a Passo:

1. **Acesse "Empresas"** no menu superior
2. **Clique em "+ Nova Empresa"**
3. **Preencha os dados:**
   - Nome da Empresa (ex: "Empresa XYZ Ltda")
   - Plano:
     - **Free:** 10 funcionários, 2 terminais
     - **Basic:** 50 funcionários, 5 terminais
     - **Premium:** Ilimitado
   - Status: Ativa
   - Data Início: Hoje (já vem preenchido)
   - Data Expiração: Daqui 1 ano (já vem preenchido)
4. **Clique em "Salvar"**
5. **Pronto!** A empresa foi criada ✅

### Observações:
- Os limites de funcionários e terminais são ajustados automaticamente ao selecionar o plano
- Você pode personalizar os limites manualmente
- Empresas inativas não podem ser acessadas pelos usuários

---

## 👨‍💼 Adicionar Admin para Empresa

Depois de criar a empresa, você precisa criar um Admin que vai gerenciá-la.

### Método Completo (Recomendado):

#### 1️⃣ Criar Usuário no Supabase Auth

1. Vá para: https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz/auth/users
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - Email: `admin@empresaxyz.com`
   - Password: `Admin@2025`
   - ✅ Marque "Auto Confirm User"
4. Clique em **Create user**
5. **Copie o UUID do usuário**

#### 2️⃣ Vincular Admin à Empresa

1. No painel SuperAdmin, vá em **"Empresas"**
2. Clique no botão **👁️ (Ver Detalhes)** da empresa
3. Na aba **"Usuários"**, clique em **"+ Adicionar Usuário"**
4. Uma mensagem aparecerá com link para o Supabase

**OU execute este SQL:**

```sql
-- 1. Primeiro, busque o UUID da empresa
SELECT id, nome FROM empresas WHERE nome LIKE '%XYZ%';

-- 2. Depois, vincule o admin
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_USUARIO_AUTH>',  -- UUID copiado do Supabase Auth
  '<UUID_DA_EMPRESA>',         -- UUID da empresa (resultado da query acima)
  'Admin Empresa XYZ',
  'admin@empresaxyz.com',
  'admin'
);
```

#### 3️⃣ Testar Login

1. Faça logout do SuperAdmin
2. Faça login com:
   - Email: `admin@empresaxyz.com`
   - Senha: `Admin@2025`
3. O Admin será redirecionado para o Dashboard da empresa dele! 🎉

---

## 🔧 Gerenciar Empresas

### Ver Detalhes da Empresa

1. Vá em **"Empresas"**
2. Clique no botão **👁️** da empresa
3. Você verá 4 abas:
   - **👥 Usuários:** Todos os usuários da empresa
   - **👨‍💼 Funcionários:** Funcionários cadastrados
   - **🖥️ Terminais:** Terminais ativos
   - **✅ Pontos:** Registros de ponto (últimos 100)

### Editar Empresa

1. Clique no botão **✏️**
2. Altere os dados necessários
3. Clique em **"Salvar"**

### Desativar Empresa

1. Clique no botão **✏️**
2. Mude o **Status** para "Inativa"
3. Salve

**Efeito:** Todos os usuários da empresa serão impedidos de fazer login.

### Excluir Empresa

1. Clique no botão **🗑️**
2. Confirme a exclusão

**⚠️ ATENÇÃO:** Isso irá **deletar TODOS os dados relacionados**:
- Usuários
- Funcionários
- Terminais
- Registros de ponto

**Esta ação NÃO pode ser desfeita!**

---

## 📊 Visualizar Dados do Sistema

### Dashboard Global

- **Total de empresas ativas**
- **Total de usuários** no sistema
- **Total de funcionários**
- **Total de terminais ativos**
- **Pontos registrados hoje**
- **Pontos registrados no mês**

### Página "Sistema"

Aqui você encontra:

1. **Informações do Sistema:**
   - Versão do PontoLabs
   - URL do Supabase
   - Tipo de banco

2. **Estatísticas do Banco:**
   - Contadores de todas as tabelas
   - Pontos dos últimos 7 dias

3. **Guia Rápido:**
   - Passo a passo ilustrado
   - Como criar empresa
   - Como criar admin
   - Como vincular usuários

4. **Links Úteis:**
   - Supabase Dashboard
   - Authentication Users
   - SQL Editor
   - GitHub

5. **Comandos SQL Úteis:**
   - Queries prontas para copiar
   - Ver todas empresas
   - Ver usuários com empresas
   - Contar registros por empresa

---

## 🔍 Filtros e Busca

### Na página "Empresas":
- 🔍 **Buscar por nome**
- Filtrar por **Status** (Ativas/Inativas)
- Filtrar por **Plano** (Free/Basic/Premium)

### Na página "Usuários":
- 🔍 **Buscar por nome ou email**
- Filtrar por **Tipo** (SuperAdmin/Admin/Funcionário/Terminal)
- Filtrar por **Empresa**

---

## 💡 Dicas Importantes

### ✅ Boas Práticas:

1. **Sempre crie primeiro no Supabase Auth** antes de vincular na tabela `usuarios`
2. **Copie os UUIDs** antes de executar os SQLs
3. **Teste o login** depois de criar cada usuário
4. **Defina senhas fortes** para os admins
5. **Configure datas de expiração** adequadas para cada empresa

### ⚠️ Cuidados:

1. **NÃO exclua empresas** sem ter certeza - a ação é irreversível
2. **NÃO compartilhe** as credenciais do SuperAdmin
3. **Backup regular** do banco de dados
4. **Monitore** a atividade pelo Dashboard

### 🐛 Problemas Comuns:

**Login não funciona:**
- Verifique se o usuário foi criado no Supabase Auth
- Verifique se o UUID está correto na tabela `usuarios`
- Verifique se a empresa está ativa (para admins)

**Empresa não aparece:**
- Recarregue a página
- Verifique os filtros aplicados
- Verifique se foi salva corretamente

**Erro ao salvar empresa:**
- Verifique os campos obrigatórios
- Verifique a conexão com o Supabase
- Veja o console do navegador (F12) para mais detalhes

---

## 🎯 Fluxo Completo de Setup

### Para começar do zero:

```
1. Criar Empresa
   ↓
2. Criar Admin no Supabase Auth
   ↓
3. Vincular Admin à Empresa (SQL)
   ↓
4. Admin faz login
   ↓
5. Admin cria Funcionários
   ↓
6. Admin cria Terminais
   ↓
7. Sistema em funcionamento! ✅
```

---

## 📞 Suporte

Se tiver dúvidas ou problemas:

1. Verifique o **Console do navegador (F12)**
2. Consulte o **SQL Editor** no Supabase
3. Verifique os **logs de autenticação** no Supabase
4. Entre em contato com o time de desenvolvimento

---

## 🎉 Pronto!

Agora você tem controle total do sistema PontoLabs através do painel SuperAdmin!

**Credenciais de Acesso:**
- URL: `http://localhost/pontolabs/pages/login.html`
- Email: `superadmin@pontolabs.com.br`
- Senha: `Super@2025`

**Próximos Passos:**
1. ✅ Criar sua primeira empresa
2. ✅ Criar o primeiro admin
3. ✅ Testar o fluxo completo
4. ✅ Configurar ambiente de produção

Boa gestão! 🚀
