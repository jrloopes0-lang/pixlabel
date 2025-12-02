<!-- Copilot instructions for AI coding agents working on the pixlabel repo -->

# `.github/copilot-instructions.md` – Instruções para Agentes de IA

**Plataforma**: PIXLABEL – Sistema de Gestão Farmacêutica para Saúde Pública  
**Stack**: Node.js/Express + React 18 + TypeScript + PostgreSQL (Drizzle ORM)  
**Última Atualização**: 1º de dezembro de 2025  
**Status**: Fase 1 (Arquitetura + Backend Básico) – ✅ Completa | Fase 2 (Frontend + Segurança) – ⏳ Pendente

---

## 1. QUICK START – BIG PICTURE

### Arquitetura Real (Estado Dec/2025)

```
PIXLABEL = Plataforma de Saúde Pública (Município Campo Alegre)
├── Módulo 1: Gestão de Estoque (Medicamentos)
│   └── Fluxo: Import Excel → Planning (3-12 meses) → Generate Orders → Track Status
├── Módulo 2: PMS/SESI (Pacientes Excepcionais)
│   └── Fluxo: Paciente → Busca → Dispensação (2 etapas) → FIFO dedução → Auditlog
└── Infraestrutura: Auth (Replit OIDC) + Audit Logs + Compliance LGPD/ANVISA
```

### Stack Atual

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| **Frontend** | React 18 + Vite + TypeScript + shadcn/ui | ⏳ Skeleton |
| **Backend** | Express.js + ESM TypeScript | ✅ 15+ rotas CRUD |
| **ORM** | Drizzle ORM + Zod schemas | ✅ 14 tabelas completas |
| **DB** | PostgreSQL (Neon serverless) | ⏳ Aguarda DATABASE_URL |
| **Auth** | Replit OIDC + Passport.js | ⏳ Middleware básico |
| **Dev Server** | Vite + Express middleware | ✅ Funcionando |

---

## 2. ESTRUTURA DE PROJETO

### Diretórios

```
/workspaces/pixlabel/
├── server/
│   ├── index-dev.ts      # ✅ Dev server (Vite + Express middleware)
│   └── routes.ts         # ✅ 15+ endpoints /api/* (CRUD completo)
├── shared/
│   ├── schema.ts         # ✅ Drizzle tabelas + Zod schemas (NEW Dec/2025)
│   └── types.ts          # ✅ Tipos de domínio TypeScript (NEW Dec/2025)
├── client/               # ⏳ Faltando – React components
│   └── src/
│       ├── App.tsx       # Router principal (não existe)
│       └── pages/        # Páginas por rota (não existe)
├── drizzle.config.ts     # ORM → ./shared/schema.ts
├── vite.config.ts        # Frontend + dev server
├── tsconfig.json         # TypeScript paths: @/*, @shared/*
└── package.json          # Scripts, 100+ dependências
```

### TypeScript Paths (tsconfig.json)

```json
{
  "paths": {
    "@/*": ["./client/src/*"],
    "@shared/*": ["./shared/*"]
  }
}
```

✅ **SEMPRE usar** nos imports: `import { Item } from "@shared/schema"`

---

## 3. COMANDOS ESSENCIAIS

### Desenvolvimento

```bash
npm run dev
# → tsx server/index-dev.ts
# → Vite + Express middleware
# → 🚀 http://localhost:3000
# → 🔥 HMR: ws://localhost:5173
```

### Verificação & Build

```bash
npm run check
# → tsc (type checking)
# → Deve retornar ZERO errors

npm run build
# → vite build (frontend)
# → esbuild (backend bundle)
# → Output: dist/public/ + dist/index.js

npm start
# → NODE_ENV=production node dist/index.js
# → Produção: http://localhost:3000
```

### Banco de Dados (Quando DB configurado)

```bash
npm run db:push
# → drizzle-kit push
# → Sincroniza schema.ts com PostgreSQL
# → Cria migrations automaticamente
```

---

## 4. ENDPOINTS API (IMPLEMENTADOS)

### Medicamentos

```
GET    /api/items                 # List all
POST   /api/items                 # Create
PATCH  /api/items/:id             # Update
DELETE /api/items/:id             # Delete
```

### Pedidos

```
GET    /api/orders                # List all
POST   /api/orders                # Create (draft)
PATCH  /api/orders/:id            # Update status
```

### Unidades & Fornecedores

```
GET    /api/units                 # List units
POST   /api/units                 # Create

GET    /api/suppliers             # List suppliers
POST   /api/suppliers             # Create
```

### SESI – Pacientes (Excepcionais)

```
GET    /api/sesi/pacientes        # List all
POST   /api/sesi/pacientes        # Create
PATCH  /api/sesi/pacientes/:id    # Update
```

### SESI – Estoque

```
GET    /api/sesi/estoque          # List SESI stock
POST   /api/sesi/estoque          # Import batch
```

### SESI – Busca de Medicamentos

```
GET    /api/sesi/medicamentos?q=search
# → Busca APENAS em estoque SESI
# → Returns: [{id, name, code, sesiQuantity}]
```

### SESI – Dispensações (⭐ FLUXO CRÍTICO)

```
POST   /api/sesi/dispensacoes

Request:
{
  "patientId": "uuid",
  "medicamentos": [
    {
      "medicationId": "uuid",
      "quantity": 10,
      "batchNumber": "LOTE-2025-001"
    }
  ]
}

Response (201):
{
  "status": "success",
  "data": {
    "success": true,
    "dispensationId": "uuid",
    "deductedItems": [{medicationId, quantityDeducted, batchNumber}],
    "message": "Dispensation completed successfully"
  }
}

Errors (400/404):
{"status": "error", "error": "Patient not found"}
```

**⚠️ CRÍTICO**: FIFO dedução por data_validade (mais antigo primeiro) – LGPD + ANVISA compliance.

---

## 5. SCHEMA DRIZZLE – TABELAS (14 Completas)

### Core Tables

- **users** – id | email (unique) | firstName | lastName | role (admin|operator) | timestamps
- **items** – id | code (unique) | name | presentation | currentStock | monthlyConsumption | minStockMonths
- **orders** – id | supplierId (FK) | status (draft|...|received) | horizonMonths | timestamps
- **orderItems** – id | orderId (FK) | itemId (FK) | quantity
- **units** – id | name | type | timestamps
- **suppliers** – id | name | contact | priority | timestamps

### SESI Tables

- **sesiPatients** – id | name | cpf (unique) | dateOfBirth | phone | address | active | timestamps
- **sesiStock** – id | itemId (FK) | batchNumber | expiryDate | quantity | timestamps
- **sesiDispensations** – id | patientId (FK) | medicationId (FK) | quantity | batchNumber | dispensedBy (FK) | timestamps

### Audit & History

- **auditLogs** – id | userId (FK) | action (create|update|delete|dispensar|import|login|logout) | entityId | entityType | changes (JSON) | ipAddress | createdAt
- **importHistory** – id | fileName | itemsCount | createdAt

---

## 6. PADRÕES DE CÓDIGO

### Backend – Route Template

```typescript
import { insertItemSchema } from "@shared/schema";

router.post("/items", (req, res) => {
  try {
    // ✅ Validar com Zod
    const data = insertItemSchema.parse(req.body);
    
    // ✅ Tipificar
    const item: Item = { id: uuid(), ...data, createdAt: new Date() };
    
    // ✅ Persistir (TODO: integrar DB real)
    storage.items.set(item.id, item);
    
    // ✅ Responder com envelope
    res.status(201).json({ status: "success", data: item });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
```

### Response Envelope (Padrão)

```typescript
// ✅ Sucesso
{ status: "success", data: {...} }
{ status: "success", data: [...], total: 100 }

// ✅ Erro
{ status: "error", error: "Descrição para usuário" }
```

### Validação Zod – OBRIGATÓRIO

```typescript
// ✅ SEMPRE
const data = insertItemSchema.parse(req.body);

// ❌ NUNCA
const item = req.body as Item;  // Tipo não é garantido em runtime!
```

---

## 7. ✅ DO / ❌ DON'T

### Imports

```typescript
// ✅ Usar paths compartilhados
import { Item, insertItemSchema } from "@shared/schema";
import type { ApiResponse } from "@shared/types";

// ❌ Caminhos relativos
import { Item } from "../../../shared/schema";
```

### Tipagem

```typescript
// ✅ Type inference
const item = { id: uuid(), code: "...", name: "..." };

// ✅ Zod validation
const validated = insertItemSchema.parse(req.body);

// ❌ any
const data: any = req.body;

// ❌ Type assertion sem validação
const item = req.body as Item;
```

### Error Handling

```typescript
// ✅ Middleware global
app.use((err: any, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({ error: err.message, status: "error" });
});

// ✅ Try-catch em rotas
catch (err: any) {
  res.status(400).json({ error: err.message, status: "error" });
}

// ❌ Sem tratamento
router.get("/items", async (req, res) => {
  // sem try-catch = crash
});
```

---

## 8. FLUXOS CRÍTICOS DE NEGÓCIO

### Fluxo 1: Gestão de Estoque

```
1. Import: POST /api/import (arquivo Excel)
2. Review: GET /api/items (editar manualmente se necessário)
3. Planning: POST /api/orders (selecionar horizon: 3/6/9/12 meses)
4. Generate: Agrupar por fornecedor, criar pedidos em draft
5. Track: PATCH /api/orders/:id (status: draft→generated→sent→authorized→committed→received)
```

### Fluxo 2: SESI – Dispensação (⭐ LEGAL COMPLIANCE)

```
Etapa 1: Selecionar Paciente
  GET /api/sesi/pacientes
  GET /api/sesi/pacientes?search=nome

Etapa 2: Dispensar Medicamentos
  POST /api/sesi/dispensacoes
  ├─ FIFO: Deduz estoque por data_validade (mais antigo primeiro)
  ├─ Validação: Stock suficiente? Expirado? CPF válido?
  └─ Audit: Registra em auditLogs (userId, action="dispensar", timestamp)

Resultado:
  ✅ Estoque SESI deduzido
  ✅ Auditlog criado
  ✅ Dispensation record imutável
```

---

## 9. PONTOS DE ATENÇÃO PARA AGENTES DE IA

### 🚨 Armadilhas Críticas

1. **Nunca pular Zod validation**
   - TODO input HTTP → schema.parse() obrigatório
   - Sem isso: dados inválidos no DB

2. **FIFO em SESI é lei**
   - Dedução por data_validade = compliance FDA CFR 21 Part 11
   - Erro aqui = não-conformidade regulatória

3. **Auditlog em tudo**
   - LGPD: cada operação (create, update, delete, dispensar) → auditLogs
   - Sem isto: violação de lei de proteção de dados

4. **CPF é sensível**
   - Será criptografado (TODO)
   - Nunca logar plain text
   - Nunca expor via API sem permissão

5. **TypeScript é obrigatório**
   - `npm run check` deve passar SEMPRE
   - Zero `any` types
   - Importar tipos via `@shared`

### ✅ Best Practices

```typescript
// ✅ Validação primeiro
const data = insertSchema.parse(req.body);

// ✅ Resposta padrão
res.json({ status: "success", data });

// ✅ Error handling
catch (err) { res.status(500).json({ error: err.message }); }

// ✅ Índices em search (performance)
// Tables: code, name, cpf, entityId, userId

// ✅ UUIDs como PK
id: uuid("id").primaryKey().defaultRandom()
```

---

## 10. WORKFLOW PARA AGENTES

### Adicionar Novo Endpoint

```
1. Criar schema Zod em shared/schema.ts (se nova tabela)
2. Exportar tipos em shared/types.ts
3. Implementar rota em server/routes.ts:
   ├─ Validar: insertSchema.parse(req.body)
   ├─ Tipificar: const item: Item = {...}
   ├─ Persistir: storage.set() [TODO: DB real]
   ├─ Try-catch + response envelope
   └─ Status codes: 201 (create), 200 (get), 400 (bad), 404 (not found), 500 (error)
4. npm run check (zero errors)
5. Testar com curl/Postman
```

### Corrigir Bug

```
1. Localizar camada: Frontend (React) | Backend (Express) | DB (Schema)
2. Procurar padrão similar existente
3. Aplicar fix mantendo estilo
4. npm run check (tipo-segurança)
5. Testar manual
```

### Implementar Segurança

```
1. Middleware em server/index-dev.ts
2. Auditlog para ações críticas
3. Criptografar dados sensíveis
4. Validar roles (admin|operator)
5. Testar E2E
```

---

## 11. VARIÁVEIS DE AMBIENTE

```bash
# Obrigatórias
DATABASE_URL=postgresql://user:pass@host:port/db
SESSION_SECRET=random-secret-for-sessions

# Opcionais
REPL_ID=seu-replit-id
NODE_ENV=development  # ou production
PERPLEXITY_API_KEY=xxx  # se usar IA features
```

---

## 12. ESTADO ATUAL & PRÓXIMOS PASSOS

| Componente | Status | Próximo Passo |
|---|---|---|
| Backend Routes | ✅ 15+ CRUD | Integrar PostgreSQL |
| Schema DB | ✅ 14 tabelas | npm run db:push |
| TypeScript | ✅ Zero errors | Manter check sempre |
| Frontend | ⏳ Não existe | Criar client/src/ |
| Auth | ⏳ Esqueleto | Replit OIDC + Passport |
| Audit Logs | ⏳ Schema OK | Middleware + triggers |
| Segurança | ⏳ LGPD required | Criptografia, rate limit |
| Testes | ❌ Zero | Adicionar Jest/Vitest |

---

## 13. DEPENDÊNCIAS IMPORTANTES

- `@neondatabase/serverless` – PostgreSQL driver
- `drizzle-orm` + `drizzle-kit` – ORM + migrations
- `zod` – Validação em runtime
- `express` – Framework HTTP
- `react` + `vite` – Frontend (não usados ainda)
- `passport` + `express-session` – Auth (instalado, não integrado)

---

## 14. REFERÊNCIAS

- **Drizzle ORM**: https://orm.drizzle.team
- **Zod**: https://zod.dev
- **Express.js**: https://expressjs.com
- **React + Vite**: https://vitejs.dev
- **shadcn/ui**: https://ui.shadcn.com
- **TanStack Query**: https://tanstack.com/query
- **PROJECT_SUMMARY**: `/workspaces/pixlabel/PROJECT_SUMMARY.md`

---

**Ambiente do contêiner dev**: Ubuntu 24.04.3 LTS, bash

**Última revisão**: 1º de dezembro de 2025 (Força-Tarefa 5 Agentes)

_Documento centralizado para orientar agentes de IA neste repositório. Mantenha atualizado com cada nova decisão arquitetural._

