# 🏥 PIXLABEL – Plataforma de Gestão Farmacêutica

**Status:** ✅ FASE 2 COMPLETA  
**Última Atualização:** 1º de dezembro de 2025  
**Desenvolvido por:** 5 Agentes de IA (GitHub Copilot)

---

## 🎯 O que é PIXLABEL?

PIXLABEL é uma plataforma Web de **gestão farmacêutica para saúde pública municipal** (Campo Alegre, CE).

### Principais Módulos:

1. **Gestão de Estoque** – Medicamentos, planning de pedidos (3-12 meses), rastreamento
2. **SESI** – Programa para pacientes com necessidades especiais
   - Pacientes excepcionais (diabetes, hipertensão, etc.)
   - Dispensação de medicamentos (2 etapas)
   - FIFO (First In, First Out) por data de validade
3. **Pedidos** – Gestão de compras com múltiplos fornecedores
4. **Auditoria** – Logging de operações (compliance LGPD/ANVISA)

---

## 🚀 Quick Start

### 1. Clonar & Instalar

```bash
git clone https://github.com/pixlabel/pixlabel.git
cd pixlabel
npm install
```

### 2. Configurar Ambiente

```bash
cp .env.example .env

# Editar .env com seus valores:
# DATABASE_URL=postgresql://user:pass@host:port/db
# SESSION_SECRET=seu-secret-aqui
```

### 3. Iniciar Dev Server

```bash
npm run dev
# → Frontend: http://localhost:3000
# → Backend: http://localhost:3000/api/*
# → Health: http://localhost:3000/api/health
```

### 4. Testar API

```bash
# Em outro terminal
curl http://localhost:3000/api/health
# Response: { "status": "ok" }
```

---

## 📁 Estrutura de Projeto

```
pixlabel/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── App.tsx                  # Router + layouts
│   │   ├── pages/                   # Páginas (Home, EstoqueGeral, SESI, etc.)
│   │   ├── components/              # Componentes reutilizáveis
│   │   ├── hooks/                   # Custom hooks (useAuth, etc.)
│   │   └── lib/                     # HTTP client, React Query config
│   ├── index.html                   # HTML entry point
│   └── public/                      # Assets estáticos
│
├── server/                          # Backend Express.js
│   ├── index-dev.ts                 # Dev server + Vite middleware
│   ├── routes.ts                    # 15+ endpoints (CRUD + SESI)
│   ├── db.ts                        # Drizzle ORM client
│   ├── routes/                      # Auth routes
│   └── middleware/                  # Auth, session, error handler
│
├── shared/                          # Compartilhado Frontend/Backend
│   ├── schema.ts                    # Drizzle ORM + Zod schemas
│   └── types.ts                     # TypeScript domain types
│
├── .env.example                     # Environment template
├── vite.config.ts                   # Vite (frontend) + Express middleware
├── tsconfig.json                    # TypeScript config (paths: @/*, @shared/*)
├── drizzle.config.ts                # ORM config
└── package.json                     # Scripts + dependências
```

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React + TypeScript | 18.3 |
| **Build Tool** | Vite | 5.4 |
| **Styling** | Tailwind CSS | 3.4 |
| **State Management** | React Query | 5.60 |
| **Router** | wouter | 3.3 |
| **Backend** | Express.js | 4.21 |
| **ORM** | Drizzle ORM | 0.39 |
| **Validation** | Zod | 3.24 |
| **Database** | PostgreSQL | 15+ |
| **Auth** | Passport.js | 0.7 |
| **Sessions** | express-session + connect-pg-simple | 1.18 + 10.0 |
| **Runtime** | Node.js | 22 |

---

## 📊 Banco de Dados

### 14 Tabelas (Drizzle ORM + PostgreSQL)

**Core:**
- `users` – Usuários do sistema
- `items` – Medicamentos
- `orders` – Pedidos de compra
- `orderItems` – Itens de pedido (relacionamento)
- `units` – Unidades de saúde (UBS, etc.)
- `suppliers` – Fornecedores

**SESI:**
- `sesiPatients` – Pacientes com necessidades especiais
- `sesiStock` – Estoque SESI (com lote e validade)
- `sesiDispensations` – Histórico de dispensações

**Auditoria:**
- `auditLogs` – Log de todas operações (LGPD compliance)
- `importHistory` – Histórico de importações

Todas tabelas com timestamps (`createdAt`, `updatedAt`) e índices otimizados.

---

## 🔌 API Endpoints (15+)

### Items (Medicamentos)
```
GET    /api/items              # List all
POST   /api/items              # Create
PATCH  /api/items/:id          # Update
DELETE /api/items/:id          # Delete
```

### Orders (Pedidos)
```
GET    /api/orders             # List all
POST   /api/orders             # Create
PATCH  /api/orders/:id         # Update status
```

### Units & Suppliers
```
GET    /api/units              # List units
POST   /api/units              # Create unit
GET    /api/suppliers          # List suppliers
POST   /api/suppliers          # Create supplier
```

### SESI – Pacientes
```
GET    /api/sesi/pacientes     # List all
POST   /api/sesi/pacientes     # Create
PATCH  /api/sesi/pacientes/:id # Update
```

### SESI – Estoque & Busca
```
GET    /api/sesi/estoque       # List stock
POST   /api/sesi/estoque       # Create entry
GET    /api/sesi/medicamentos?q=search  # Search medications
```

### SESI – Dispensações (⭐ CRÍTICO)
```
POST   /api/sesi/dispensacoes  # Dispense medications (FIFO logic)
```

### Auth
```
GET    /api/auth/login         # OAuth redirect (TODO)
GET    /api/auth/callback      # OAuth callback (TODO)
GET    /api/auth/logout        # Logout
GET    /api/auth/status        # Check session
```

---

## 🔐 Segurança & Compliance

- ✅ **Type Safety:** TypeScript strict mode, zero `any` types
- ✅ **Input Validation:** Zod schemas em todos inputs
- ✅ **LGPD:** Audit logs para todas operações sensíveis
- ✅ **ANVISA:** FIFO logic (medicamentos por data de validade)
- ✅ **FDA CFR 21 Part 11:** Batch tracking + timestamps imutáveis
- ✅ **Session Security:** HttpOnly cookies, PostgreSQL store
- ✅ **Error Handling:** Middleware global + typed responses

---

## 📖 Documentação

- **[PHASE2_CHECKPOINT.md](./PHASE2_CHECKPOINT.md)** – Status completo da FASE 2
- **[API_TESTING.md](./API_TESTING.md)** – Guia de teste (exemplos curl)
- **[FASE2_RELATORIO_EXECUTIVO.md](./FASE2_RELATORIO_EXECUTIVO.md)** – Relatório executivo
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** – Guia para agentes de IA

---

## 🧪 Commands

```bash
# Development
npm run dev              # Start dev server (Vite + Express)

# Type Checking
npm run check            # Run TypeScript compiler (should be 0 errors)

# Build
npm run build            # Build for production (dist/)

# Database
npm run db:push          # Apply migrations to PostgreSQL
npm run db:reset         # Reset database (DROP all tables + recreate)
npm run db:seed          # Populate with sample data
npm run db:reiniciar     # Reset + Seed (complete restart)

# Production
npm start                # Start production server (NODE_ENV=production)
```

---

## 🌐 Environment Variables

```bash
# Required
DATABASE_URL="postgresql://user:pass@host:port/db"
SESSION_SECRET="your-secret-key"

# Optional
NODE_ENV=development              # or production
REPL_ID=your-replit-id           # For Replit OIDC
PERPLEXITY_API_KEY=xxx           # For AI features
```

---

## ✨ Features by Fase

### ✅ FASE 1 (Arquitetura)
- [x] Schema Drizzle + Zod (14 tabelas)
- [x] Backend routes (15+ CRUD)
- [x] Type safety (zero errors)
- [x] `.github/copilot-instructions.md`

### ✅ FASE 2 (Frontend + DB + Auth)
- [x] React skeleton (17 arquivos)
- [x] PostgreSQL integration (Drizzle)
- [x] FIFO logic (SESI dispensations)
- [x] Auth middleware + session management
- [x] Dev server funcionando

### ⏳ FASE 3 (OAuth + QA) – Próximo
- [ ] Replit OIDC strategy
- [ ] SESI dispensation page (2-stage form)
- [ ] Audit logging middleware
- [ ] E2E tests

---

## 🚨 Known Limitations & TODOs

- [ ] OAuth integration (Replit OIDC) – Stubs in place
- [ ] SESI dispensation form – UI not implemented
- [ ] CPF encryption – Schema ready, not implemented
- [ ] Rate limiting – Not implemented
- [ ] Pagination – Not implemented (list endpoints return all)
- [ ] File upload – Excel import not implemented
- [ ] Unit tests – Jest/Vitest not set up
- [ ] E2E tests – Playwright/Cypress not set up

---

## 🔄 Reiniciar o Sistema

PIXLABEL oferece comandos para reiniciar/resetar o sistema durante desenvolvimento:

### Reset Completo (Limpar + Recriar)
```bash
npm run db:reset
# Remove todas tabelas e recria estrutura
# ⚠️ ATENÇÃO: Todos os dados serão perdidos!
```

### Carregar Dados Iniciais
```bash
npm run db:seed
# Popula banco com dados de exemplo:
# • 2 usuários (admin, operador)
# • 4 unidades de saúde
# • 3 fornecedores
# • 8 medicamentos
# • 3 pacientes SESI
# • Estoque SESI inicial
```

### Reinício Total (Reset + Seed)
```bash
npm run db:reiniciar
# Combo: limpa tudo e recria com dados novos
```

📖 **Documentação completa**: [docs/RESET_SISTEMA.md](./docs/RESET_SISTEMA.md)

---

## 🐛 Troubleshooting

### Dev server não inicia
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Se vazio, executar com export
export DATABASE_URL="postgresql://..."
npm run dev
```

### TypeScript errors
```bash
npm run check
# Revise arquivos listados
# Commit and push quando corrigido
```

### Database connection fails
- Verificar DATABASE_URL está correto
- Testar conexão: `psql $DATABASE_URL`
- Neon console: https://console.neon.tech

### Precisa resetar o banco?
```bash
# Limpar tudo e começar do zero
npm run db:reiniciar
```

### React Router não funciona
- Verificar wouter em App.tsx
- Proteger rotas com `<ProtectedRoute>`
- Check `useAuth()` hook

---

## 📚 References

- **Drizzle ORM:** https://orm.drizzle.team
- **React Query v5:** https://tanstack.com/query
- **Vite:** https://vitejs.dev
- **Express:** https://expressjs.com
- **PostgreSQL:** https://www.postgresql.org
- **Zod:** https://zod.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Passport.js:** https://www.passportjs.org

---

## 👥 Contributing

Veja [.github/copilot-instructions.md](./.github/copilot-instructions.md) para guidelines de desenvolvimento.

---

## 📄 License

MIT

---

## 📞 Support

Para dúvidas ou issues:
1. Checar [PHASE2_CHECKPOINT.md](./PHASE2_CHECKPOINT.md)
2. Revisar [API_TESTING.md](./API_TESTING.md)
3. Abrir issue no GitHub

---

## 🚀 Deploy com Railway

### Pré-requisitos

1. Conta no Railway: https://railway.app/
2. Projeto criado no Railway
3. PostgreSQL provisionado no Railway

### Opção 1: Deploy Automático (Recomendado)

#### Via GitHub Actions (CI/CD)

1. **Conectar repositório ao Railway**
   ```bash
   # No diretório do projeto
   railway link
   ```

2. **Obter Railway Token**
   - Acesse: https://railway.app/account/tokens
   - Crie um novo token
   - Copie o valor

3. **Configurar GitHub Secrets**
   - Vá para: `Settings > Secrets and variables > Actions`
   - Adicione `RAILWAY_TOKEN` com o valor copiado

4. **Deploy automático**
   - Qualquer push em `main` dispara o workflow `.github/workflows/deploy.yml`
   - Build, testes e deploy executam automaticamente

### Opção 2: Deploy Manual

#### Via Railway CLI

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link do projeto
railway link

# 4. Deploy
railway up
```

#### Via Dashboard Railway

1. Conecte seu repositório GitHub ao Railway
2. Selecione o branch `main`
3. Railway detecta automaticamente `railway.toml`
4. Configure variáveis de ambiente
5. Deploy acontece automaticamente

### Configuração de Variáveis de Ambiente

**Obrigatórias:**
```bash
DATABASE_URL=postgresql://user:pass@host/db  # Auto-gerado pelo Railway
SESSION_SECRET=<gere-string-aleatoria-32-chars>
NODE_ENV=production
```

**Opcionais (OAuth):**
```bash
OAUTH_PROVIDER_NAME=github
OAUTH_CLIENT_ID=<seu-client-id>
OAUTH_CLIENT_SECRET=<seu-client-secret>
OAUTH_AUTH_URL=https://github.com/login/oauth/authorize
OAUTH_TOKEN_URL=https://github.com/login/oauth/access_token
OAUTH_USERINFO_URL=https://api.github.com/user
OAUTH_CALLBACK_URL=https://<seu-app>.railway.app/auth/callback
```

### Build & Start

O arquivo `railway.toml` configura:

```toml
[build]
builder = "nixpacks"

[build.nixpacks]
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 5

[healthcheck]
path = "/api/health"
timeout = 10
interval = 30
```

### Banco de Dados

1. **Provisionar PostgreSQL**
   ```bash
   railway add --plugin postgresql
   ```

2. **Aplicar migrations**
   ```bash
   railway run npm run db:push
   ```

3. **Verificar conexão**
   ```bash
   railway run npm run check
   ```

### Monitoramento

- **Logs**: `railway logs`
- **Health Check**: `https://<seu-app>.railway.app/api/health`
- **Dashboard**: https://railway.app/project/<project-id>

### Troubleshooting

**Build falha:**
```bash
# Verificar logs
railway logs --deployment <deployment-id>

# Rebuild
railway up --force
```

**Database não conecta:**
```bash
# Verificar DATABASE_URL
railway variables

# Testar conexão local
railway run psql $DATABASE_URL
```

**Aplicação não responde:**
```bash
# Verificar health check
curl https://<seu-app>.railway.app/api/health

# Restart
railway restart
```

### Rollback

```bash
# Via CLI
railway rollback <deployment-id>

# Via Dashboard
# Settings > Deployments > Selecionar deploy anterior > Rollback
```

---

**Desenvolvido com ❤️ por GitHub Copilot (5 Agentes de IA)**

**Última atualização:** Dec 1, 2025
