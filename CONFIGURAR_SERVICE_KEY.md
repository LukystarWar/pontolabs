# 🔑 Configurar Service Role Key - SuperAdmin

## 📋 O que é isso?

A **Service Role Key** permite que o SuperAdmin crie usuários automaticamente pelo painel, sem precisar acessar o Supabase Dashboard toda vez!

## ⚡ Configuração Rápida (2 minutos)

### PASSO 1: Pegar a Service Role Key

1. Acesse: https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz/settings/api
2. Role para baixo até "Project API keys"
3. Procure por **"service_role"**
4. Clique no ícone 👁️ para revelar a key
5. Clique em **copiar** 📋

### PASSO 2: Colar no arquivo de configuração

1. Abra o arquivo: `assets/js/superadmin-config.js`
2. Encontre esta linha:
```javascript
const SUPABASE_SERVICE_KEY = 'COLE_SUA_SERVICE_ROLE_KEY_AQUI';
```
3. Substitua `'COLE_SUA_SERVICE_ROLE_KEY_AQUI'` pela key copiada
4. Deve ficar assim:
```javascript
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```
5. Salve o arquivo

### PASSO 3: Testar

1. Recarregue a página do SuperAdmin (Ctrl+Shift+R)
2. Vá em "Empresas"
3. Clique em uma empresa
4. Na aba "Usuários", clique em "+ Adicionar Usuário"
5. Preencha o formulário
6. Clique em "Criar Admin"
7. ✅ Pronto! Admin criado automaticamente!

---

## 🎯 O que você ganha:

### Antes (sem Service Key):
```
1. Ir no Supabase Dashboard
2. Authentication → Users
3. Add User
4. Preencher dados
5. Copiar UUID
6. Ir no SQL Editor
7. Executar INSERT
8. Verificar se funcionou
Total: ~5 minutos por admin
```

### Depois (com Service Key):
```
1. Clicar em "Adicionar Usuário"
2. Preencher formulário
3. Criar Admin
4. Copiar credenciais
Total: ~30 segundos! 🚀
```

---

## ⚠️ Segurança

### IMPORTANTE:

1. ❌ **NÃO compartilhe** a Service Role Key
2. ❌ **NÃO commite** o arquivo com a key no Git
3. ❌ **NÃO exponha** a key publicamente
4. ✅ **USE apenas** nas páginas de SuperAdmin
5. ✅ **Mantenha** o arquivo local

### Por que é seguro no seu caso:

- ✅ O arquivo só é carregado nas páginas do SuperAdmin
- ✅ Apenas você tem acesso ao SuperAdmin
- ✅ A key fica no seu servidor local (XAMPP)
- ✅ Não vai para produção sem você querer

### Para produção:

Se for colocar em produção, considere:
- Usar variáveis de ambiente (Netlify, Vercel)
- Criar Netlify Functions para criar usuários
- Restringir acesso ao painel SuperAdmin por IP
- Usar autenticação mais robusta

---

## 🔍 Como saber se está configurado?

Execute no console do navegador (F12):

```javascript
checkServiceKeyConfigured()
```

**Retornou `true`?** ✅ Configurado!
**Retornou `false`?** ❌ Não configurado, siga os passos acima.

---

## 🐛 Problemas Comuns

### "Service Role Key não configurada"

**Causa:** Você não colocou a key ou colocou errada.

**Solução:**
1. Verifique se salvou o arquivo
2. Verifique se a key está entre aspas
3. Recarregue a página (Ctrl+Shift+R)

### "Erro ao criar admin: 400"

**Causa:** Key inválida ou expirada.

**Solução:**
1. Copie a key novamente do Supabase
2. Certifique-se de copiar a **service_role** (não a anon)
3. Cole novamente no arquivo

### "Email já em uso"

**Causa:** Já existe um usuário com este email.

**Solução:**
1. Use outro email
2. Ou delete o usuário existente no Supabase Auth

---

## 📝 Localização do arquivo

```
c:\xampp\htdocs\pontolabs\assets\js\superadmin-config.js
```

**Linha para editar:** Linha 11

---

## ✨ Pronto!

Depois de configurar, você pode:

✅ Criar Admin em 30 segundos
✅ Criar Funcionário automaticamente (futuro)
✅ Criar Terminal automaticamente (futuro)
✅ Sem precisar do Supabase Dashboard

**Muito mais produtivo!** 🚀

---

## 🔗 Links Úteis

- **Pegar Service Key:** https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz/settings/api
- **Arquivo para editar:** `assets/js/superadmin-config.js`
- **Testar:** Página de Empresas → Detalhes → "+ Adicionar Usuário"

---

**Configurado com sucesso?** Agora você pode criar empresas e admins em minutos! 🎉
