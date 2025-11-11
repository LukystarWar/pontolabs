# 🕐 PontoLabs - Sistema de Ponto Digital

Sistema completo de ponto digital com QR Code dinâmico, multi-empresa e painel SuperAdmin.

## 🚀 Início Rápido

### Para SuperAdmin (Você):

1. **Configure uma vez:**
   - Criar usuário SuperAdmin → `[Ver guia](docs/SETUP_RAPIDO.md)`
   - Configurar Service Key → `[Ver guia](docs/CONFIGURAR_SERVICE_KEY.md)`

2. **Entregar para cliente:**
   - Criar empresa pelo painel (30s)
   - Criar admin da empresa (30s)
   - Enviar credenciais → `[Ver fluxo](docs/FLUXO_COMPLETO.md)`

### Para Admin (Cliente):

1. Fazer login com credenciais recebidas
2. Criar funcionários e terminais
3. Visualizar relatórios e exportar dados

---

## ✨ Funcionalidades

### 🔐 SuperAdmin
- ✅ Dashboard com visão geral de todas empresas
- ✅ CRUD completo de empresas
- ✅ Criar admins automaticamente (sem SQL manual!)
- ✅ Gerenciar todos os usuários do sistema
- ✅ Estatísticas e monitoramento

### 👨‍💼 Admin (Empresa)
- ✅ Gerenciar funcionários e terminais
- ✅ Visualizar relatórios de pontos
- ✅ Exportar dados (CSV)
- ✅ Dashboard com estatísticas da empresa

### 🖥️ Terminal
- ✅ QR Code dinâmico (muda a cada 30 segundos)
- ✅ Modo fullscreen para tablets
- ✅ Interface limpa e responsiva

### 👤 Funcionário
- ✅ Scanner QR Code via câmera
- ✅ Registrar entrada/saída
- ✅ Histórico de pontos
- ✅ App mobile (PWA)

---

## 📚 Documentação

### Para Começar:
- **[Setup Rápido](docs/SETUP_RAPIDO.md)** - Configure em 5 minutos
- **[Fluxo Completo](docs/FLUXO_COMPLETO.md)** - Como entregar para clientes
- **[Como Usar](docs/COMO_USAR.md)** - Guia de uso geral

### SuperAdmin:
- **[Guia SuperAdmin](docs/GUIA_SUPERADMIN.md)** - Guia completo
- **[Configurar Service Key](docs/CONFIGURAR_SERVICE_KEY.md)** - Criar admins automaticamente

### Técnico:
- **[Setup Supabase](docs/SETUP_SUPABASE.md)** - Configurar banco de dados
- **[Deploy](docs/DEPLOY.md)** - Colocar em produção
- **[Instruções](docs/INSTRUCOES.md)** - Detalhes técnicos

### Resolução de Problemas:
- **[Corrigir Erro Login](docs/CORRIGIR_ERRO_LOGIN.md)** - Problemas com SuperAdmin

---

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Backend:** Supabase (PostgreSQL + Auth)
- **QR Code:** qrcode.js + html5-qrcode
- **PWA:** Service Worker + Manifest
- **Deploy:** Netlify / Vercel / Servidor próprio

---

## 📁 Estrutura do Projeto

```
pontolabs/
├── index.html                 # Landing page
├── pages/
│   ├── login.html             # Login único
│   ├── superadmin/            # Painel SuperAdmin
│   ├── admin/                 # Dashboard empresas
│   ├── terminal.html          # QR Code
│   └── funcionario.html       # Scanner
├── assets/
│   ├── js/                    # Scripts
│   ├── css/                   # Estilos
│   └── icons/                 # Ícones PWA
├── database/                  # SQL schemas
├── docs/                      # Documentação
└── README.md                  # Este arquivo
```

---

## ⚡ Características

- ✅ **Multi-empresa** com isolamento de dados (RLS)
- ✅ **QR Code dinâmico** com expiração de 30 segundos
- ✅ **Segurança** com JWT e hash SHA-256
- ✅ **Progressive Web App** (funciona offline)
- ✅ **Responsivo** (mobile-first)
- ✅ **Sem dependências** de frameworks pesados
- ✅ **Fácil de deployar** (arquivos estáticos)

---

## 🎯 Tipos de Usuário

| Tipo | Acesso | Após Login |
|------|--------|------------|
| **SuperAdmin** | Todas empresas | Painel de gestão |
| **Admin** | Sua empresa | Dashboard da empresa |
| **Terminal** | QR Code | Tela de QR Code |
| **Funcionário** | Scanner | App de ponto |

---

## 🚦 Status do Projeto

✅ **Pronto para produção!**

- [x] Painel SuperAdmin completo
- [x] CRUD de empresas
- [x] Criar admins automaticamente
- [x] Multi-empresa funcionando
- [x] QR Code dinâmico
- [x] Scanner funcionando
- [x] Relatórios e exportação
- [x] Documentação completa

---

## 📊 Limites do Supabase (Free Tier)

| Recurso | Limite | Observação |
|---------|--------|------------|
| Banco | 500 MB | ~1000 funcionários |
| API | 2 GB/mês | ~100k requests |
| Auth | 50k users | Mais que suficiente |
| Storage | 1 GB | Para fotos (se implementar) |

**Para produção séria:** Considere Plano Pro ($25/mês)

---

## 🔧 Configuração Mínima

1. Criar projeto no Supabase
2. Executar SQL em `database/schema.sql`
3. Configurar credenciais em `assets/js/config.js`
4. Configurar Service Key (opcional, mas recomendado)
5. Abrir `index.html` no navegador

**Total: ~10 minutos**

---

## 📞 Suporte

- 📖 Documentação completa na pasta `docs/`
- 🐛 Console do navegador (F12) para debug
- 🗄️ Supabase Dashboard para gerenciar banco
- 💻 GitHub Issues para reportar problemas

---

## 📄 Licença

MIT License - Castro Labs

---

## 👨‍💻 Autor

**Castro Labs**
- GitHub: [@LukystarWar](https://github.com/LukystarWar)

---

## 🎉 Começar Agora

1. **Leia:** [docs/SETUP_RAPIDO.md](docs/SETUP_RAPIDO.md)
2. **Configure:** Supabase + Service Key
3. **Teste:** Crie empresa e admin
4. **Entregue:** Primeiro cliente!

**Boa sorte!** 🚀

---

**PontoLabs** • Sistema de Ponto Digital com Multi-Empresa
