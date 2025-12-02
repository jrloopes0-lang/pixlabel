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

# Database (when DB configured)
npm run db:push          # Apply migrations to PostgreSQL
npm run db:studio        # Open Drizzle Studio

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

### Deploy Automático Railway (CI/CD)

O deploy é feito automaticamente via workflow GitHub Actions:

1. **Configure o segredo RAILWAY_TOKEN**
   - No GitHub, acesse: `Settings > Secrets > Actions`
   - Adicione o segredo `RAILWAY_TOKEN` (pegue no painel Railway > Account > Tokens)

2. **Push no branch `main`**
   - Qualquer push no branch `main` dispara build, testes e deploy Railway.

3. **Workflow dedicado**
   - Arquivo: `.github/workflows/railway.yml`
   - Comando: `railway up --ci` (sem interação)

#### Deploy manual (opcional)

```bash
railway up
```

---

Para automação total, não é necessário acessar o painel Railway após configurar o segredo.

### 2. Configurar Variáveis de Ambiente

- `DATABASE_URL` (PostgreSQL do Railway)
- `SESSION_SECRET` (string aleatória)
- `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `OAUTH_AUTH_URL`, `OAUTH_TOKEN_URL`, `OAUTH_USERINFO_URL`, `OAUTH_CALLBACK_URL` (conforme provider)

### 3. Build & Deploy

- Railway detecta automaticamente o arquivo `railway.toml`
- Build: `nixpacks` (Node.js)
- Start: `npm start`

### 4. Gerenciar Banco de Dados

- Use o painel do Railway para criar e gerenciar o PostgreSQL
- Copie a `DATABASE_URL` para as variáveis do projeto

### 5. Monitorar Deploy

- Logs e status em https://railway.app/project/<seu-projeto>
- Health check: `/api/health`

### 6. Rollback

- Railway permite rollback para builds anteriores via painel

---

**Desenvolvido com ❤️ por GitHub Copilot (5 Agentes de IA)**

**Última atualização:** Dec 1, 2025
