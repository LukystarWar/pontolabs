# 🚀 Guia de Deploy - PontoLabs

## 📋 Checklist Pré-Deploy

### 1. Supabase Setup

- [x] Executar `database/schema.sql` no SQL Editor
- [ ] Copiar Project URL
- [ ] Copiar anon/public key
- [ ] Copiar service_role key (Settings → API)
- [ ] Atualizar `assets/js/config.js` com as credenciais

### 2. Criar Usuários Iniciais (via Supabase Dashboard)

#### Criar Admin:
1. Vá em Authentication → Users
2. Clique em "Add user"
3. Email: `admin@suaempresa.com`
4. Password: (defina uma senha segura)
5. Após criar, copie o UUID do usuário

#### Inserir no banco:
```sql
-- Pegar o UUID da empresa criada
SELECT id FROM empresas WHERE nome = 'Empresa Teste Premium';

-- Inserir usuário admin na tabela usuarios
INSERT INTO usuarios (id, empresa_id, nome, email, role)
VALUES (
  '<UUID_DO_AUTH_USER>',
  '<UUID_DA_EMPRESA>',
  'Admin Teste',
  'admin@suaempresa.com',
  'admin'
);
```

#### Criar Terminal:
1. No Supabase Auth, crie outro usuário: `terminal@suaempresa.com`
2. Insira na tabela usuarios com role 'terminal'
3. Insira na tabela terminais:

```sql
INSERT INTO terminais (empresa_id, usuario_id, nome, localizacao, ativo, chave_secreta)
VALUES (
  '<UUID_DA_EMPRESA>',
  '<UUID_DO_TERMINAL_AUTH>',
  'Terminal Principal',
  'Recepção',
  true,
  '<GERAR_CHAVE_ALEATORIA>'
);
```

#### Criar Funcionário:
1. Criar usuário no Auth: `funcionario@suaempresa.com`
2. Inserir em usuarios com role 'funcionario'
3. Inserir em funcionarios:

```sql
INSERT INTO funcionarios (empresa_id, usuario_id, nome, cargo, turno, ativo)
VALUES (
  '<UUID_DA_EMPRESA>',
  '<UUID_DO_FUNCIONARIO_AUTH>',
  'João Silva',
  'Operador',
  'Integral',
  true
);
```

## 🌐 Deploy no Netlify

### Opção 1: Via GitHub (Recomendado)

1. **Push para GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - PontoLabs MVP"
git branch -M main
git remote add origin https://github.com/LukystarWar/pontolabs.git
git push -u origin main
```

2. **Conectar no Netlify:**
   - Acesse https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Conecte com GitHub
   - Selecione o repositório `pontolabs`
   - Build settings (já configurado no netlify.toml):
     - Build command: (deixe vazio)
     - Publish directory: `.`
     - Functions directory: `netlify/functions`

3. **Configurar Variáveis de Ambiente:**
   - Vá em Site settings → Environment variables
   - Adicione:
     ```
     SUPABASE_URL=https://pfbynyflbtdlnozqtgxz.supabase.co
     SUPABASE_SERVICE_KEY=sua-service-key-aqui
     JWT_SECRET=pontolabs-secret-key-2025-change-in-production
     ```

4. **Deploy:**
   - Clique em "Deploy site"
   - Aguarde o build
   - Site estará online em: `https://seu-site.netlify.app`

### Opção 2: Via Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

## 🔧 Pós-Deploy

### 1. Testar Funcionalidades

- [ ] Login Admin
- [ ] Login Terminal (gera QR?)
- [ ] Login Funcionário (scanner funciona?)
- [ ] CRUD Funcionários
- [ ] CRUD Terminais
- [ ] Registrar ponto
- [ ] Visualizar relatórios
- [ ] Exportar CSV

### 2. Configurar Domínio Customizado (Opcional)

1. Netlify → Domain settings
2. Add custom domain
3. Adicionar registros DNS no seu provedor

### 3. Ativar HTTPS

- Netlify faz isso automaticamente
- Aguardar provisionamento do certificado SSL

## 🎨 Criar Ícones PWA

Use um gerador online como:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Gere ícones 192x192 e 512x512 e coloque em `assets/icons/`

## ✅ Configuração Completa!

Seu sistema está no ar em: `https://seu-site.netlify.app`

### Credenciais de Teste:
- **Admin:** admin@suaempresa.com
- **Terminal:** terminal@suaempresa.com
- **Funcionário:** funcionario@suaempresa.com

## 📱 Instalar como PWA

### Android:
1. Abra o site no Chrome
2. Menu → "Adicionar à tela inicial"

### iOS:
1. Abra no Safari
2. Compartilhar → "Adicionar à Tela de Início"

### Desktop (Chrome):
1. Ícone de instalação na barra de endereço
2. Ou: Menu → "Instalar PontoLabs..."

---

🎉 **Pronto! Seu sistema está funcionando!**
