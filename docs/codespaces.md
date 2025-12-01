# PIXELLAB no GitHub Codespaces

Este guia resume como preparar e trabalhar no Codespaces para rodar o front-end React/Vite e o back-end Express/Drizzle em modo de desenvolvimento com recarregamento automático.

## Visão geral da stack
- **Front-end**: React + Vite (raiz em `client/`), HMR habilitado.
- **Back-end**: Express em `server/`, expondo rotas sob `/api` e servindo o front durante o desenvolvimento.
- **Banco/ORM**: Drizzle ORM com esquema em `shared/schema.ts` e configuração em `drizzle.config.ts` (usa `DATABASE_URL`).

## Passo a passo para abrir o Codespace
1. Abra o repositório no Codespaces (botão **Code → Create codespace**).
2. Aguarde o contêiner ser criado com base em `.devcontainer/devcontainer.json` (Node 20, extensões Prettier/ESLint/Tailwind). O `postCreateCommand` executa `npm install` automaticamente.
3. Certifique-se de que as portas 3000 (API + front) e 5173 (HMR) estão encaminhadas; o Codespaces mostrará notificações automáticas.

## Instalação das dependências
- A instalação padrão (`npm install`) completa em poucos segundos e atualmente aponta 10 vulnerabilidades (3 low, 5 moderate, 2 high). Utilize `npm audit fix` ou `npm audit fix --force` se desejar corrigir automaticamente, revisando eventuais breaking changes.
- O npm exibe o aviso `Unknown env config "http-proxy"`; remova a variável de ambiente correspondente ou ignore caso não utilize proxy.

## Comandos principais
- **Verificar tipos**: `npm run check`
- **Iniciar dev server (Express + Vite middleware)**: `npm run dev`
  - Variáveis úteis: `PORT=3000`, `HOST=0.0.0.0`, `VITE_HMR_PORT=5173`, `DATABASE_URL=<postgres>`
- **Build de produção**: `npm run build` seguido de `npm start` (serve `dist/public` e API).

## Fluxo de desenvolvimento
- **Front-end**: edite arquivos em `client/src`. O Vite HMR recarrega automaticamente via websocket (porta 5173) enquanto o app é servido em `http://localhost:3000`.
- **Back-end**: adicione rotas em `server/routes.ts` ou arquivos adicionais e registre no Express. O servidor reinicia automaticamente com tsx a cada alteração.
- **Schemas compartilhdos**: defina tabelas em `shared/schema.ts` e use no back-end. Ajuste `drizzle.config.ts` para apontar para o schema.

## Testar o backend
- Com o servidor em execução (`npm run dev`), verifique o health check: `curl http://localhost:3000/api/health`.
- Para novos endpoints, siga o padrão `/api/<recurso>` e responda JSON. Considere adicionar validações com Zod conforme as dependências existentes.

## Criar novas rotas
1. Crie handlers Express em `server/routes.ts` (ou em novos módulos importados ali).
2. Use `app.use("/api", router)` para manter o prefixo `/api`.
3. Atualize o front-end para consumir os novos endpoints usando `fetch` ou React Query.

## Usar Drizzle ORM
1. Configure `DATABASE_URL` no ambiente (por exemplo, via secrets do Codespaces).
2. Modele tabelas em `shared/schema.ts` utilizando os helpers do Drizzle.
3. Rode `npm run db:push` para aplicar as mudanças no banco.
4. Importe o schema e o client do Drizzle no back-end para consultas.

## Dicas para edição
- Utilize as extensões recomendadas (Prettier, ESLint, Tailwind) para manter o padrão de código.
- Paths curtos já estão configurados em `tsconfig.json` (`@/*` para `client/src` e `@shared/*` para `shared`).
- O build do front fica em `dist/public`, servido pelo Express em produção.
