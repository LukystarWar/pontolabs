# 🚀 Como Usar o PontoLabs - Guia Rápido

## 📌 Visão Geral

O PontoLabs é um sistema de ponto digital com 4 tipos de usuários:

| Tipo | O que faz | Como acessa |
|------|-----------|-------------|
| **🔐 SuperAdmin** | Gerencia TODAS as empresas do sistema | Painel próprio |
| **👨‍💼 Admin** | Gerencia sua empresa (funcionários, terminais, relatórios) | Dashboard da empresa |
| **🖥️ Terminal** | Exibe QR Code para funcionários escanearem | Tela fullscreen |
| **👤 Funcionário** | Bate ponto escaneando QR Code | App mobile |

---

## 🎯 Começando do Zero

### 1️⃣ Criar SuperAdmin (VOCÊ - só precisa fazer 1 vez)

```sql
-- No Supabase Auth, crie o usuário superadmin@pontolabs.com.br
-- Copie o UUID e execute:

INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_COPIADO>',
  NULL,
  'SuperAdmin PontoLabs',
  'superadmin@pontolabs.com.br',
  'superadmin'
);
```

**Login SuperAdmin:**
- URL: `/pages/login.html`
- Email: `superadmin@pontolabs.com.br`
- Senha: (a que você definiu no Supabase)
- Será redirecionado para: `/pages/superadmin/dashboard.html`

---

### 2️⃣ Criar Primeira Empresa

1. **Acesse o painel SuperAdmin**
2. Clique em **"Empresas"**
3. Clique em **"+ Nova Empresa"**
4. Preencha:
   - Nome: "Minha Empresa Teste"
   - Plano: Premium
   - Status: Ativa
5. **Salvar**

✅ Empresa criada!

---

### 3️⃣ Criar Admin da Empresa

**No Supabase Dashboard:**

1. Authentication → Users → Add user
2. Email: `admin@minhaempresa.com`
3. Password: `Admin@123`
4. ✅ Auto Confirm User
5. **Copie o UUID**

**No SQL Editor:**

```sql
-- Buscar UUID da empresa
SELECT id, nome FROM empresas WHERE nome LIKE '%Teste%';

-- Vincular admin (substitua os UUIDs)
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_USUARIO>',
  '<UUID_DA_EMPRESA>',
  'Admin Teste',
  'admin@minhaempresa.com',
  'admin'
);
```

✅ Admin criado e vinculado!

---

### 4️⃣ Admin Cria Funcionários

**Login como Admin:**
- Email: `admin@minhaempresa.com`
- Senha: `Admin@123`
- Será redirecionado para: `/pages/admin/dashboard.html`

**Criar Funcionário:**

1. Vá em **"Funcionários"**
2. Clique em **"+ Novo Funcionário"**
3. Preencha:
   - Nome: João Silva
   - Email: joao@empresa.com
   - Senha: Func@123
   - Cargo: Operador
   - Turno: Integral
4. **Salvar**

O sistema automaticamente:
- ✅ Cria o usuário no Supabase Auth
- ✅ Vincula à empresa
- ✅ Cria registro de funcionário

---

### 5️⃣ Admin Cria Terminal

1. Vá em **"Terminais"**
2. Clique em **"+ Novo Terminal"**
3. Preencha:
   - Nome: Terminal Recepção
   - Email: terminal@empresa.com
   - Senha: Term@123
   - Localização: Recepção - 1º Andar
4. **Salvar**

O sistema automaticamente:
- ✅ Cria o usuário no Supabase Auth
- ✅ Vincula à empresa
- ✅ Cria registro de terminal

---

### 6️⃣ Usar o Sistema

#### 🖥️ Terminal (em um tablet na recepção):

1. Login: `terminal@empresa.com` / `Term@123`
2. Tela mostra QR Code que muda a cada 30 segundos
3. Deixe o tablet na recepção

#### 👤 Funcionário (no celular):

1. Login: `joao@empresa.com` / `Func@123`
2. Seleciona: Entrada ou Saída
3. Escaneia o QR Code do terminal
4. **Ponto registrado!** ✅

#### 👨‍💼 Admin (visualizar relatórios):

1. Vá em **"Relatórios"**
2. Selecione período
3. Veja todos os pontos
4. Exporte para CSV se precisar

---

## 🔐 Credenciais Padrão de Teste

Você pode criar estas credenciais para testar:

| Tipo | Email | Senha | Acesso |
|------|-------|-------|--------|
| SuperAdmin | superadmin@pontolabs.com.br | Super@2025 | Painel SuperAdmin |
| Admin | admin@minhaempresa.com | Admin@123 | Dashboard Empresa |
| Terminal | terminal@minhaempresa.com | Term@123 | Tela QR Code |
| Funcionário | funcionario@minhaempresa.com | Func@123 | Scanner QR |

---

## 📱 Fluxo de Uso Diário

```
MANHÃ:
1. Terminal já está ligado na recepção (QR Code aparece)
2. João chega e faz login no celular
3. Seleciona "Entrada"
4. Escaneia o QR Code
5. ✅ Entrada registrada às 08:00

ALMOÇO:
6. João seleciona "Saída"
7. Escaneia o QR Code
8. ✅ Saída registrada às 12:00

TARDE:
9. João seleciona "Entrada"
10. Escaneia o QR Code
11. ✅ Entrada registrada às 13:00

FIM DO DIA:
12. João seleciona "Saída"
13. Escaneia o QR Code
14. ✅ Saída registrada às 18:00

ADMIN (quando quiser):
15. Acessa Relatórios
16. Vê todos os pontos do dia
17. Exporta CSV para folha de pagamento
```

---

## 🎨 URLs Importantes

| Página | URL | Quem Acessa |
|--------|-----|-------------|
| Login | `/pages/login.html` | Todos |
| SuperAdmin | `/pages/superadmin/dashboard.html` | SuperAdmin |
| Admin Dashboard | `/pages/admin/dashboard.html` | Admin |
| Funcionários | `/pages/admin/funcionarios.html` | Admin |
| Terminais | `/pages/admin/terminais.html` | Admin |
| Relatórios | `/pages/admin/relatorios.html` | Admin |
| Terminal QR | `/pages/terminal.html` | Terminal |
| Funcionário Scanner | `/pages/funcionario.html` | Funcionário |

---

## 🆘 Resolução de Problemas

### ❌ Não consigo fazer login

**Verifique:**
1. Email e senha estão corretos
2. Usuário existe no Supabase Auth (Authentication → Users)
3. Usuário está vinculado na tabela `usuarios`
4. Empresa está ativa (para admins/funcionários/terminais)

**SQL para verificar:**
```sql
SELECT u.*, e.nome as empresa, e.ativa
FROM usuarios u
LEFT JOIN empresas e ON e.id = u.empresa_id
WHERE u.email = 'seuemail@exemplo.com';
```

### ❌ QR Code não funciona

**Verifique:**
1. QR Code está sendo atualizado (muda a cada 30 segundos)
2. Funcionário está usando o scanner correto
3. Câmera do celular tem permissão
4. Terminal está ativo

### ❌ Ponto não registra

**Verifique:**
1. Funcionário está ativo
2. Terminal está ativo
3. Empresa está ativa
4. Conexão com internet/Supabase está ok

---

## 💡 Dicas Profissionais

### Para SuperAdmin:
- ✅ Crie uma empresa de teste antes de criar empresas reais
- ✅ Teste todo o fluxo antes de entregar para clientes
- ✅ Configure limites adequados para cada plano
- ✅ Monitore o Dashboard regularmente

### Para Admin:
- ✅ Crie funcionários e terminais assim que possível
- ✅ Teste o QR Code logo após criar o terminal
- ✅ Exporte relatórios regularmente (backup)
- ✅ Mantenha cadastros atualizados

### Para Terminal:
- ✅ Use um tablet fixo na parede/recepção
- ✅ Configure para não desligar a tela automaticamente
- ✅ Deixe em modo fullscreen (F11)
- ✅ Mantenha conectado à internet

### Para Funcionário:
- ✅ Salve o atalho do sistema na tela inicial do celular
- ✅ Permita acesso à câmera quando solicitado
- ✅ Aproxime o celular do QR Code para melhor leitura
- ✅ Aguarde a confirmação de registro antes de sair

---

## 📊 Arquitetura do Sistema

```
SuperAdmin
    └── Gerencia TODAS as Empresas
         └── Empresa A
              ├── Admin A (gerencia Empresa A)
              ├── Funcionários A
              ├── Terminais A
              └── Pontos A
         └── Empresa B
              ├── Admin B (gerencia Empresa B)
              ├── Funcionários B
              ├── Terminais B
              └── Pontos B
```

**Isolamento:**
- ✅ Admin A NÃO vê dados da Empresa B
- ✅ Funcionários só veem seus próprios pontos
- ✅ Terminais só geram QR para sua empresa
- ✅ SuperAdmin vê TUDO

---

## 🎯 Próximos Passos

1. ✅ **Leia o GUIA_SUPERADMIN.md** para detalhes completos
2. ✅ **Crie seu SuperAdmin** (passo 1️⃣)
3. ✅ **Crie uma empresa de teste** (passo 2️⃣)
4. ✅ **Teste o fluxo completo** (passos 3️⃣ a 6️⃣)
5. ✅ **Configure produção** quando tudo estiver ok

---

## 🚀 Deploy em Produção

Quando estiver tudo testado e funcionando:

1. **Configure domínio próprio**
2. **Configure SSL (HTTPS)**
3. **Mude JWT_SECRET em config.js**
4. **Configure backup automático do Supabase**
5. **Monitore uso do Supabase (limites do plano Free)**

Se ultrapassar limites do Free, considere:
- Plano Pro do Supabase ($25/mês)
- PostgreSQL próprio (VPS)
- Outras alternativas de BaaS

---

## 📞 Suporte

- 📖 Documentação: `GUIA_SUPERADMIN.md`
- 🐛 Problemas: Veja console do navegador (F12)
- 🗄️ Banco: Supabase Dashboard
- 💻 Código: GitHub do projeto

---

**Pronto! Você está preparado para usar o PontoLabs! 🎉**

Qualquer dúvida, consulte o `GUIA_SUPERADMIN.md` para informações mais detalhadas.
