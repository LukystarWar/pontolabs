Crie um projeto web app (PWA) completo chamado “PontoLabs”, um sistema de ponto digital baseado em QR Code, feito em HTML, CSS e JavaScript puro, com integração ao Supabase (PostgreSQL + Auth + Storage) e hospedagem no Netlify. O sistema deve ser totalmente funcional, responsivo e preparado para uso real, servindo como MVP para portfólio e possível SaaS no futuro.

O projeto terá três tipos principais de acesso: ADMIN, TERMINAL e FUNCIONÁRIO. Todos os usuários pertencem a uma EMPRESA. Deve haver também um SUPERADMIN, usado apenas por nós para gestão geral das empresas no futuro.

---

### Estrutura geral e objetivos

O objetivo é criar um sistema de ponto digital confiável, com autenticação, QR Code dinâmico, cache offline via PWA e relatórios úteis. O sistema será liberado inicialmente no plano PREMIUM (sem limitações), mas já deve possuir estrutura para futuros planos Free, Pro e Plus. 

Todos os recursos devem funcionar mesmo sem cobrança, e o sistema precisa estar preparado para ser expandido sem necessidade de refatorar a base.

---

### Funcionalidades

**Admin (empresa)**
- Login via Supabase Auth.
- Dashboard com resumo de batidas diárias (presenças, atrasos, ausências).
- Cadastro e edição de funcionários (nome, e-mail, cargo, turno, status).
- Cadastro e gerenciamento de terminais (nome, local, ativo/inativo).
- Relatórios mensais com total de horas, atrasos, faltas e extras.
- Exportação de relatórios em PDF e CSV.
- Filtro por funcionário, data e tipo de batida (entrada/saída).
- Exibição de plano atual (ex: “Plano Premium liberado”).
- Painel de uso (mostra número de funcionários, terminais e registros).
- Painel de configurações da empresa.

**Terminal**
- Login com tipo “terminal”.
- Exibe QR Code dinâmico (JWT com expiração de 30 segundos).
- QR inclui empresa_id, terminal_id, nonce, iat, exp.
- Modo tela cheia, sem menus, otimizado para tablets.
- Mesmo offline, continua exibindo QR rotativo e sincroniza quando voltar.

**Funcionário**
- Login via Supabase Auth.
- Tela de leitura de QR (usando câmera do celular).
- Ao ler o QR, envia:
  - funcionario_id
  - token_qr
  - hora local
  - localização GPS
  - IP (capturado automaticamente)
  - foto (opcional)
- Sistema valida o token (assinatura e expiração) e registra ponto.
- Se offline, salva localmente (IndexedDB) e sincroniza depois.

---

### Estrutura de banco (Supabase)

**empresas**
- id
- nome
- plano (varchar, ex: 'premium', 'free', 'pro', 'plus')
- limite_funcionarios (int)
- limite_terminais (int)
- ativa (bool)
- data_inicio (timestamp)
- data_expiracao (timestamp)

**usuarios**
- id
- empresa_id
- nome
- email
- senha
- role ('superadmin', 'admin', 'funcionario', 'terminal')

**funcionarios**
- id
- empresa_id
- nome
- cargo
- turno
- ativo (bool)
- criado_em

**terminais**
- id
- empresa_id
- nome
- localizacao
- ativo (bool)
- chave_publica

**pontos**
- id
- funcionario_id
- terminal_id
- empresa_id
- tipo ('entrada', 'saida')
- data_hora
- gps_lat
- gps_lng
- ip
- foto_url
- hash_registro
- criado_em

---

### PWA e funcionamento offline

- Manifest.json completo (nome, ícones, tema verde #00BE28).
- Service Worker com cache offline e sincronização automática.
- Botão customizado “Instalar app” (via evento beforeinstallprompt).
- Permitir instalação em Android e iOS.
- Terminal e Funcionário devem funcionar offline (armazenando dados e sincronizando depois).

---

### Backend / API

Usar funções serverless (Netlify Functions ou Supabase Edge Functions):

- **issue-terminal-qr**: gera JWT curto assinado com chave secreta.
- **register-ponto**: valida token, grava registro no banco, gera hash SHA-256 e salva foto.
- Triggers no Supabase impedem UPDATE/DELETE em “pontos”.
- Logs de falhas e duplicações (QR expirado ou reusado).

---

### Relatórios e estatísticas

- Dashboard com estatísticas visuais (horas por dia, atrasos, extras).
- Exportação de relatórios em PDF (jsPDF) e CSV.
- Histórico completo no plano Premium (sem limites por enquanto).
- Previsão futura de limitação de histórico para plano Free.

---

### Planos (estrutura futura, mas sem restrição ativa no MVP)

- **Free**: 1 terminal, funcionários ilimitados, histórico de 30 dias.
- **Pro**: até 3 terminais, histórico completo, relatórios avançados.
- **Plus**: até 10 terminais, exportações automáticas e suporte prioritário.
- **Premium**: plano completo, sem limites (versão atual de lançamento).

No MVP, todas as empresas começarão como Premium liberado. O código deve estar preparado para aplicar restrições no futuro, mas sem bloquear nada agora.

---

### Visual e experiência

- Tema: verde (#00BE28) e branco.
- Layout limpo, responsivo e moderno.
- Login e dashboard com aparência profissional.
- Mostrar sempre o plano ativo no painel.
- Footer com “PontoLabs • Castro Labs”.

---

### Estratégia técnica

- Estrutura multiempresa desde o início (campo empresa_id em todas as tabelas).
- Todos os usuários vinculados a uma empresa.
- Acesso Superadmin reservado para gestão de empresas e planos.
- Permitir criação e desativação de empresas.
- Todo o sistema modular e pronto para ser transformado em SaaS com planos pagos futuros.

---

### Objetivo final

Entregar um MVP completo, confiável e bonito, que funcione 100% (QR dinâmico, relatórios, offline, exportações), servindo inicialmente para um cliente parceiro (plano Premium liberado), mas já pronto para expansão futura como SaaS multiempresa, com planos e cobrança recorrente se o projeto escalar.
