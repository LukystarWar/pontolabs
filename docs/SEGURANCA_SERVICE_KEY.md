# 🔒 Segurança da Service Key

## ⚠️ IMPORTANTE: Service Key é SENSÍVEL!

A **Service Role Key** do Supabase tem **poderes administrativos** completos no seu banco de dados. Por isso, ela **NUNCA** deve ser exposta publicamente!

---

## 🛡️ Como Configuramos a Segurança

### 1. Arquivo no .gitignore

O arquivo `assets/js/superadmin-config.js` está **bloqueado** no `.gitignore`:

```gitignore
# Service Key (NÃO COMMITAR!)
assets/js/superadmin-config.js
```

✅ Isso garante que mesmo se você der `git add -A`, o arquivo NÃO será commitado!

### 2. Arquivo de Exemplo

Criamos `superadmin-config.example.js` que:
- ✅ **PODE** ser commitado (não tem a key real)
- ✅ Serve como template para outros desenvolvedores
- ✅ Tem instruções de como configurar

---

## 📋 Setup para Novo Desenvolvedor

Se outra pessoa for trabalhar no projeto:

### Passo 1: Copiar arquivo de exemplo
```bash
cp assets/js/superadmin-config.example.js assets/js/superadmin-config.js
```

### Passo 2: Obter Service Key
1. Acessar: https://supabase.com/dashboard/project/SEU_PROJETO/settings/api
2. Copiar "service_role" key

### Passo 3: Configurar
1. Abrir: `assets/js/superadmin-config.js`
2. Substituir `'COLE_SUA_SERVICE_ROLE_KEY_AQUI'` pela key real
3. Salvar

### Passo 4: Verificar
```bash
# O arquivo NÃO deve aparecer aqui:
git status
```

Se aparecer, algo está errado no .gitignore!

---

## 🚨 Se Você Commitou a Key por Engano

### 1. NÃO ENTRE EM PÂNICO!

### 2. ROTACIONE A KEY IMEDIATAMENTE:
1. Acesse: https://supabase.com/dashboard/project/SEU_PROJETO/settings/api
2. Clique em "Generate new service_role key"
3. Isso invalida a key antiga
4. Copie a nova key
5. Atualize no seu `superadmin-config.js` local

### 3. Limpe o histórico do Git:
```bash
# Remover do último commit
git rm --cached assets/js/superadmin-config.js
git commit --amend -m "Remove service key"

# Se já fez push, considere:
git push --force origin main
```

### 4. Adicione ao .gitignore se ainda não estiver:
```bash
echo "assets/js/superadmin-config.js" >> .gitignore
git add .gitignore
git commit -m "Add service key to gitignore"
```

---

## ✅ Verificações de Segurança

### Antes de cada commit:

1. **Verificar .gitignore:**
```bash
cat .gitignore | grep superadmin-config.js
```
Deve mostrar: `assets/js/superadmin-config.js`

2. **Verificar o que será commitado:**
```bash
git status
```
NÃO deve listar: `assets/js/superadmin-config.js`

3. **Ver arquivos staged:**
```bash
git diff --cached --name-only
```
NÃO deve aparecer: `assets/js/superadmin-config.js`

---

## 🔐 Melhores Práticas

### ✅ FAÇA:
- Use o arquivo de exemplo como template
- Mantenha a key localmente
- Adicione ao .gitignore
- Rotacione a key periodicamente
- Use variáveis de ambiente em produção

### ❌ NÃO FAÇA:
- Commitar a Service Key
- Compartilhar a key por email/chat
- Postar em fóruns/Stack Overflow
- Deixar em código público
- Usar a mesma key em dev/prod

---

## 🌐 Produção (Netlify/Vercel)

Para produção, use **variáveis de ambiente**:

### Netlify:
1. Site Settings → Environment Variables
2. Adicionar: `SUPABASE_SERVICE_KEY` = sua key
3. No código, usar: `process.env.SUPABASE_SERVICE_KEY`

### Vercel:
1. Project Settings → Environment Variables
2. Adicionar: `SUPABASE_SERVICE_KEY` = sua key
3. No código, usar: `process.env.SUPABASE_SERVICE_KEY`

### Exemplo de código para produção:
```javascript
// Detecta se está em produção
const isProduction = window.location.hostname !== 'localhost';

const SUPABASE_SERVICE_KEY = isProduction
  ? process.env.SUPABASE_SERVICE_KEY // Produção (variável de ambiente)
  : 'sua-key-local'; // Desenvolvimento (arquivo local)
```

---

## 📝 Checklist de Segurança

Antes de fazer push:

- [ ] `.gitignore` contém `assets/js/superadmin-config.js`
- [ ] `git status` NÃO lista `superadmin-config.js`
- [ ] Arquivo de exemplo (`.example.js`) está commitado
- [ ] Service Key está apenas no arquivo local
- [ ] README menciona o setup da Service Key

---

## 🆘 Perguntas Frequentes

### "Posso commitar o arquivo com key em repo privado?"

**NÃO!** Mesmo repos privados podem:
- Ser acessados por colaboradores
- Ter permissões alteradas
- Ser hackeados
- Virar públicos por engano

Sempre use .gitignore!

### "E se eu precisar compartilhar com outro dev?"

Use método seguro:
- Gerenciador de senhas (1Password, LastPass)
- Mensagem criptografada
- Variáveis de ambiente no servidor

**NUNCA por email, Slack, WhatsApp!**

### "Como saber se a key está segura?"

Se você:
- ✅ Não commitou
- ✅ Não compartilhou publicamente
- ✅ Não postou em lugar público

**Então está segura!**

### "Preciso rotacionar a key?"

Rotacione se:
- ❌ Commitou por engano
- ❌ Compartilhou sem querer
- ❌ Suspeita de exposição
- ✅ Periodicamente (a cada 6 meses é bom)

---

## 🔗 Links Úteis

- **Gerenciar Keys:** https://supabase.com/dashboard/project/SEU_PROJETO/settings/api
- **Docs Supabase:** https://supabase.com/docs/guides/api#api-keys
- **GitHub Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

## ✨ Resumo

1. ✅ Service Key no `.gitignore`
2. ✅ Arquivo exemplo commitado
3. ✅ Arquivo real apenas local
4. ✅ Variáveis de ambiente em produção
5. ✅ Nunca commitar keys!

**Segurança sempre em primeiro lugar!** 🔒

---

**Tem dúvidas sobre segurança?** Melhor perguntar do que arriscar! 🛡️
