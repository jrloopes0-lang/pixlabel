<!-- Copilot instructions for AI coding agents working on the pixlabel repo -->
# Instruções rápidas para agentes AI

Este arquivo reúne conhecimento prático e verificável para começar a trabalhar rapidamente neste repositório.

**Visão geral (Big picture)**
- **Frontend:** app React + Vite (configuração em `vite.config.ts`, Tailwind em `tailwind.config.ts`).
- **Backend:** Express embutido via middleware Vite no dev server (`server/index-dev.ts`). API montada em `/api` com rotas em `server/routes.ts`.
- **Build / Prod:** `npm run build` executa `vite build` (frontend) e usa `esbuild` para empacotar `server/index-prod.ts` em `dist/index.js`. Produção é `NODE_ENV=production node dist/index.js` (`npm start`).
- **Banco:** Drizzle ORM configurado em `drizzle.config.ts` (usa `process.env.DATABASE_URL`) e comando `npm run db:push` para aplicar migrations.

**Comandos essenciais (extraídos de `package.json`)**
- `npm run dev` → dev server: `tsx server/index-dev.ts` (Vite + HMR). Use este comando para desenvolvimento local.
- `npm run build` → gera frontend e bundle do servidor.
- `npm start` → executa o build de produção: `node dist/index.js`.
- `npm run check` → `tsc` (verificações TypeScript).
- `npm run db:push` → `drizzle-kit push` (persistence/migrations).

**Padrões e convenções do projeto**
- Código do servidor fica em `server/` e é escrito como ESM TypeScript (package.json tem `type: "module"`).
- Durante desenvolvimento o servidor usa Vite como middleware (veja `vite.middlewares` em `server/index-dev.ts`); para alterações no frontend prefira `npm run dev` em vez de iniciar o backend separado.
- Rotas API simples são definidas como `express.Router()` e exportadas por padrão (ex.: `server/routes.ts`). Para adicionar um endpoint: criar arquivo em `server/` e montar com `app.use('/api/your', yourRouter)`.
- Banco: config em `drizzle.config.ts` aponta `schema: ./shared/schema.ts` — siga esse arquivo para entender tabelas/colunas compartilhadas.

**Pontos de integração / dependências externas**
- Dependências DB: `@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit` — assegure `DATABASE_URL` disponível em ambiente.
- Auth: `passport`, `passport-local` e `express-session` estão instalados — procure integrações se trabalhar com auth.
- OpenAI client está presente (`openai` dependency) — cuidado ao alterar uso de chaves/variáveis de ambiente.

**Exemplos práticos (como agir)**
- Adicionar rota GET em `server/routes.ts`:

```ts
// server/routes.ts (padrão)
const router = express.Router();
router.get('/health', (_req, res) => res.json({ status: 'ok' }));
export default router;
```

- Adicionar nova API: criar `server/myFeature.ts` exportando `Router`, então em `server/index-dev.ts` adicionar `app.use('/api/my-feature', myFeatureRouter)`.

**Erros e verificações comuns**
- Sempre verifique `process.env.DATABASE_URL` ao iniciar localmente (veja `drizzle.config.ts`).
- Em dev use `npm run dev` para não precisar lidar com bundle do servidor; em produção siga `npm run build` → `npm start`.
- Types & build: rode `npm run check` após mudanças de tipos grandes.

**Ambiente do contêiner dev**
- Conteiner de desenvolvimento: Ubuntu 24.04.3 LTS, shell `bash` por padrão.

Seções que requerem confirmação do revisor
- Onde devo documentar políticas de modelos AI (por ex. habilitar "Claude Haiku 4.5")? Se for configuração de CI/infra, preciso do local exato (ex.: arquivo de configuração do provedor, `replit.md`, ou painel de administração).

---
Por favor, revise estas instruções e diga o que está incompleto ou incorreto; pedirei detalhes para ajustar e mesclar com qualquer `copilot-instructions.md` existente se houver.
