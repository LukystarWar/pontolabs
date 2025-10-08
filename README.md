# 🕐 PontoLabs

Sistema de ponto digital com QR Code dinâmico, desenvolvido com HTML, CSS e JavaScript puro.

## 🚀 Features

- ✅ Autenticação com Supabase
- ✅ QR Code dinâmico (30 segundos) com Web Crypto API
- ✅ Scanner QR Code via câmera
- ✅ Dashboard administrativo
- ✅ CRUD de funcionários e terminais
- ✅ Relatórios com exportação CSV
- ✅ PWA (Progressive Web App)
- ✅ Funcionamento offline com sincronização
- ✅ Multi-empresa
- ✅ Responsivo (mobile-first)

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Conta no [Netlify](https://netlify.com) (para deploy)
- Node.js (opcional, apenas para development local)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/LukystarWar/pontolabs.git
cd pontolabs
```

### 2. Configure o Supabase

1. Crie um projeto no Supabase
2. Execute o SQL em `database/schema.sql` no SQL Editor
3. Copie as credenciais (Project URL e anon key)
4. Cole em `assets/js/config.js`

### 3. Configure as variáveis de ambiente (Netlify)

Copie `.env.example` para `.env` e configure:

```env
SUPABASE_URL=sua-url-aqui
SUPABASE_SERVICE_KEY=sua-service-key-aqui
JWT_SECRET=sua-secret-key-aqui
```

### 4. Deploy no Netlify

1. Conecte o repositório GitHub ao Netlify
2. Configure as variáveis de ambiente no Netlify
3. Deploy automático!

Ou via Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📱 Uso

### Acesso Admin

1. Acesse `https://seu-site.netlify.app`
2. Faça login com suas credenciais
3. Gerencie funcionários e terminais
4. Visualize relatórios

### Terminal

1. Login com usuário tipo "terminal"
2. Modo fullscreen para tablets
3. QR Code rotativo a cada 30 segundos

### Funcionário

1. Login via app
2. Selecione tipo (entrada/saída)
3. Escaneie o QR Code do terminal
4. Ponto registrado!

## 🏗️ Estrutura do Projeto

```
pontolabs/
├── assets/
│   ├── css/          # Estilos (global, admin, terminal, mobile)
│   ├── js/           # Scripts (auth, db, qr, etc)
│   └── icons/        # Ícones PWA
├── pages/
│   ├── admin/        # Dashboard, funcionários, terminais, relatórios
│   ├── login.html
│   ├── terminal.html
│   └── funcionario.html
├── netlify/
│   └── functions/    # Serverless functions
├── database/
│   └── schema.sql    # SQL do banco
├── manifest.json     # PWA manifest
├── sw.js            # Service Worker
└── netlify.toml     # Config Netlify
```

## 🔐 Segurança

- JWT com HMAC-SHA256
- QR Code expira em 30 segundos
- Row Level Security (RLS) no Supabase
- Pontos não podem ser editados/excluídos (trigger)
- Hash SHA-256 de cada registro

## 🎨 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Netlify Functions (Node.js)
- **Banco:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **PWA:** Service Worker + Manifest
- **QR:** qrcode.js + html5-qrcode

## 📄 Licença

MIT License - Castro Labs

## 👨‍💻 Autor

**Castro Labs**
- GitHub: [@LukystarWar](https://github.com/LukystarWar)

---

**PontoLabs** • Sistema de Ponto Digital 🕐
