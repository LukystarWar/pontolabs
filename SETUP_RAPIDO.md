# ⚡ Setup Rápido - PontoLabs

## 📋 Checklist 5 Minutos

### ✅ PASSO 1: Criar SuperAdmin (2 min)

```bash
1. Abrir: https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz/auth/users
2. Clicar: "Add User"
3. Preencher:
   - Email: superadmin@pontolabs.com.br
   - Password: Super@2025
   - ✅ Auto Confirm User
4. Copiar: UUID do usuário
5. Abrir: SQL Editor
6. Colar e executar:

INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_COPIADO>',
  NULL,
  'SuperAdmin PontoLabs',
  'superadmin@pontolabs.com.br',
  'superadmin'
);
```

### ✅ PASSO 2: Login (30 seg)

```
URL: http://localhost/pontolabs/pages/login.html
Email: superadmin@pontolabs.com.br
Senha: Super@2025
```

### ✅ PASSO 3: Criar Empresa (1 min)

```
1. Clicar: "Empresas"
2. Clicar: "+ Nova Empresa"
3. Preencher:
   - Nome: Empresa Teste
   - Plano: Premium
   - Status: Ativa
4. Salvar
```

### ✅ PASSO 4: Criar Admin (2 min)

```bash
# No Supabase:
1. Authentication → Users → Add User
2. Email: admin@teste.com
3. Password: Admin@123
4. ✅ Auto Confirm
5. Copiar UUID

# No SQL Editor:
SELECT id FROM empresas WHERE nome LIKE '%Teste%';
# Copiar UUID da empresa

INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_USUARIO>',
  '<UUID_DA_EMPRESA>',
  'Admin Teste',
  'admin@teste.com',
  'admin'
);
```

### ✅ PRONTO! Sistema Funcionando!

---

## 🎯 Teste Rápido

```
1. Logout do SuperAdmin
2. Login como Admin (admin@teste.com)
3. Criar 1 Funcionário
4. Criar 1 Terminal
5. Login como Terminal (ver QR Code)
6. Login como Funcionário (scanner)
7. Registrar ponto
8. Ver no Relatório
✅ FUNCIONOU!
```

---

## 📞 Credenciais Padrão

| Tipo | Email | Senha | URL após Login |
|------|-------|-------|----------------|
| SuperAdmin | superadmin@pontolabs.com.br | Super@2025 | /pages/superadmin/dashboard.html |
| Admin | admin@teste.com | Admin@123 | /pages/admin/dashboard.html |
| Terminal | (criar no painel) | (definir) | /pages/terminal.html |
| Funcionário | (criar no painel) | (definir) | /pages/funcionario.html |

---

## 🔥 Comandos SQL Úteis

### Ver todas empresas
```sql
SELECT * FROM empresas ORDER BY criado_em DESC;
```

### Ver todos usuários
```sql
SELECT u.nome, u.email, u.role, e.nome as empresa
FROM usuarios u
LEFT JOIN empresas e ON e.id = u.empresa_id
ORDER BY u.criado_em DESC;
```

### Contar tudo
```sql
SELECT
  (SELECT COUNT(*) FROM empresas) as empresas,
  (SELECT COUNT(*) FROM usuarios) as usuarios,
  (SELECT COUNT(*) FROM funcionarios) as funcionarios,
  (SELECT COUNT(*) FROM terminais) as terminais,
  (SELECT COUNT(*) FROM pontos) as pontos;
```

### Deletar empresa de teste
```sql
-- ⚠️ CUIDADO: Deleta TUDO relacionado!
DELETE FROM empresas WHERE nome = 'Empresa Teste';
```

---

## 🆘 Problemas Comuns

### ❌ Erro: "Role inválido"
```sql
-- Verificar:
SELECT * FROM usuarios WHERE email = 'seuemail@exemplo.com';
-- Role deve ser: superadmin, admin, funcionario ou terminal
```

### ❌ Erro: "Empresa inativa"
```sql
-- Ativar empresa:
UPDATE empresas SET ativa = true WHERE nome = 'Empresa Teste';
```

### ❌ Login não funciona
```
1. Usuário existe no Supabase Auth?
2. Usuário existe na tabela usuarios?
3. UUID está correto?
4. Empresa está ativa? (para admin/func/term)
```

---

## 📱 URLs Diretas

```
Login:           /pages/login.html
SuperAdmin:      /pages/superadmin/dashboard.html
Admin:           /pages/admin/dashboard.html
Funcionários:    /pages/admin/funcionarios.html
Terminais:       /pages/admin/terminais.html
Relatórios:      /pages/admin/relatorios.html
Terminal QR:     /pages/terminal.html
Funcionário App: /pages/funcionario.html
```

---

## 🎨 Estrutura Visual

```
┌─────────────────────────────────────┐
│         🔐 SUPERADMIN               │
│  (Você - Gerencia tudo)             │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
┌──────────────┐    ┌──────────────┐
│  EMPRESA A   │    │  EMPRESA B   │
│  Admin A     │    │  Admin B     │
│  10 Funcs    │    │  5 Funcs     │
│  2 Terms     │    │  1 Term      │
└──────────────┘    └──────────────┘
```

---

## ⚡ Atalhos de Teclado

```
F12     - Console (debug)
F11     - Fullscreen (terminal)
Ctrl+R  - Recarregar página
Ctrl+Shift+R - Recarregar (limpar cache)
```

---

## 🎯 Fluxo de Produção

```
1. SuperAdmin cria Empresa
         ↓
2. SuperAdmin cria Admin da Empresa
         ↓
3. Admin cria Funcionários
         ↓
4. Admin cria Terminais
         ↓
5. Funcionários batem ponto
         ↓
6. Admin visualiza relatórios
         ↓
7. SuperAdmin monitora tudo
```

---

## 📊 Supabase Free - Limites

| Item | Limite | Observação |
|------|--------|------------|
| Banco | 500 MB | ~1000 funcionários OK |
| API | 2 GB/mês | ~100k requests |
| Auth | 50k users | Mais que suficiente |
| Pausa | 7 dias | Auto-reativa |

**Upgrade:** $25/mês (Pro)

---

## 🚀 Deploy Produção

```bash
# 1. Domínio
exemplo.com.br

# 2. SSL
Let's Encrypt (grátis)

# 3. Hospedagem
- Netlify (grátis)
- Vercel (grátis)
- GitHub Pages (grátis)
- Servidor próprio

# 4. Configurar
- Atualizar URLs em config.js
- Mudar JWT_SECRET
- Configurar domínio customizado

# 5. Backup
- Ativar backup Supabase
- Exportar dados semanalmente
```

---

## ✅ Checklist Final

- [ ] SuperAdmin criado
- [ ] Login SuperAdmin OK
- [ ] Empresa criada
- [ ] Admin criado
- [ ] Login Admin OK
- [ ] Funcionário criado
- [ ] Terminal criado
- [ ] QR Code aparecendo
- [ ] Scanner funcionando
- [ ] Ponto registrado
- [ ] Relatório OK
- [ ] Export CSV OK
- [ ] Sistema entendido
- [ ] Pronto para produção

---

## 📚 Documentação Completa

- **COMO_USAR.md** - Guia básico
- **GUIA_SUPERADMIN.md** - Guia completo
- **README_NOVO.md** - Visão geral nova estrutura

---

## 💡 Dica Final

**Explore o painel SuperAdmin!**
Clique em tudo, teste tudo, veja os detalhes.
Em 15 minutos você domina o sistema! 🚀

---

**Criado por: Castro Labs**
**Versão: 1.0.0**
**Data: 2025**
