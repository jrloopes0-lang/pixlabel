# PIXELLAB – Fase 4 (Produção)

## Objetivo
Guia rápido para preparar o ambiente de produção, executar os testes automatizados e publicar a build completa (frontend + API) sem dependências do Replit.

## Pré-requisitos
- Node.js 20+
- PostgreSQL 15+ (local ou gerenciado)
- Variáveis de ambiente obrigatórias:
  - `DATABASE_URL` – string de conexão Postgres (ex.: `postgres://user:pass@host:5432/pixellab`)
  - `DRIZZLE_ADAPTER` – opcional, use `neon` quando estiver em Neon/Serverless
  - `SESSION_SECRET` – segredo para cookies de sessão
  - `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `OIDC_REDIRECT_URI` – para o provedor OAuth genérico

## Passo a passo de deploy
1) **Instalar dependências**
```bash
npm ci
```
2) **Rodar checagens e testes**
```bash
npm run check
npm run test
```
3) **Build completa**
```bash
npm run build
```
4) **Criar banco/migrations (opcional para mock)**
```bash
npm run db:push
```
5) **Subir servidor**
```bash
PORT=4173 NODE_ENV=production DATABASE_URL=postgres://... npm start
```
O servidor servirá os assets compilados de `dist/public` e responderá `GET /health` para smoke tests.

## CI/CD (GitHub Actions)
- Workflow `ci.yml` instala dependências com `npm ci`, roda `npm run check`, `npm run test`, `npm run build`.
- Serviço Postgres 16 é provisionado no runner e exposto via `DATABASE_URL` para validar integração.
- Um smoke test sobe `npm start` em background e confirma resposta do `/health`.

## Operação
- Logs: use stdout/stderr (já suportado pelo Node). Adapte para Stackdriver/CloudWatch conforme o provedor.
- Monitoramento: healthcheck em `/health` e métricas de DB via Postgres.
- Rollback: manter a build anterior de `dist/` e redeployar em caso de falha.

## Estado atual
- Frontend React Router pronto para navegação visual.
- API com fallback para mocks quando `DATABASE_URL` não está definido.
- Autenticação em modo placeholder no frontend; backend preparado para plugar OIDC via variáveis de ambiente.
