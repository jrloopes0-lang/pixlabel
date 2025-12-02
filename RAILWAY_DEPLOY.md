# 🚀 PIXLABEL - Railway Deployment Guide

**Status:** ✅ PRONTO PARA DEPLOY  
**Data:** 2 de dezembro de 2025  
**Branch:** main (commit 62d8faf)

---

## ✅ Checklist Pré-Deploy

### Build & Tests
- [x] TypeScript compilation: **0 errors** (`npm run check`)
- [x] Unit tests: **16/16 passing** (`npm run test:unit`)
- [x] Production build: **dist/ generated** (`npm run build`)
- [x] Dependencies: **wouter installed** (routing)
- [x] Railway config: **railway.toml** configurado

### Documentation
- [x] README.md atualizado com instruções Railway
- [x] .env.example completo
- [x] .railwayignore criado
- [x] GitHub Actions workflow: `.github/workflows/railway.yml`

### Code Quality
- [x] All imports fixed (default vs named exports)
- [x] No duplicate files (removed Pms.tsx)
- [x] Security middleware validated
- [x] API routes functional (15+ endpoints)

---

## 🏗️ Arquitetura de Deploy

```
GitHub (main branch)
    ↓
GitHub Actions (.github/workflows/railway.yml)
    ↓
Railway Platform
    ├── Build: npm install && npm run build
    ├── Start: npm start (NODE_ENV=production)
    ├── Health Check: /api/health (30s interval)
    └── PostgreSQL: Neon serverless DB
```

---

## 🔧 Setup Railway (Primeira Vez)

### 1. Criar Projeto Railway

```bash
# Via Dashboard
https://railway.app/new

# Via CLI
railway login
railway init
railway link
```

### 2. Provisionar PostgreSQL

```bash
# Via Dashboard: Add > PostgreSQL

# Via CLI
railway add postgresql
```

### 3. Configurar Variáveis de Ambiente

**No Railway Dashboard > Variables:**

```bash
# Obrigatórias
DATABASE_URL=${RAILWAY_POSTGRESQL_URL}  # Auto-gerado
SESSION_SECRET=<gerar-com-openssl-rand-base64-32>
NODE_ENV=production

# Opcionais (OAuth)
OAUTH_PROVIDER_NAME=github
OAUTH_CLIENT_ID=<seu-client-id>
OAUTH_CLIENT_SECRET=<seu-client-secret>
OAUTH_AUTH_URL=https://github.com/login/oauth/authorize
OAUTH_TOKEN_URL=https://github.com/login/oauth/access_token
OAUTH_USERINFO_URL=https://api.github.com/user
OAUTH_CALLBACK_URL=https://<seu-app>.railway.app/auth/callback
```

**Gerar SESSION_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Conectar GitHub

1. Railway Dashboard > Settings
2. Connect GitHub Repository
3. Selecionar `jrloopes0-lang/pixlabel`
4. Branch: `main`
5. Auto-deploy: Enabled

### 5. Aplicar Migrations

```bash
railway run npm run db:push
```

---

## 🚦 Deploy Automático (CI/CD)

### Via GitHub Actions

1. **Obter Railway Token**
   ```bash
   railway login
   railway whoami
   # https://railway.app/account/tokens
   ```

2. **Configurar GitHub Secret**
   - Repositório > Settings > Secrets and variables > Actions
   - New repository secret:
     - Name: `RAILWAY_TOKEN`
     - Value: <token-copiado>

3. **Deploy Automático**
   - Qualquer push em `main` dispara o workflow
   - Steps:
     1. Type check (`npm run check`)
     2. Unit tests (`npm run test:unit`)
     3. Build (`npm run build`)
     4. Deploy (`railway up --ci`)

---

## 🛠️ Deploy Manual

### Opção 1: Railway CLI

```bash
# 1. Install CLI (se não tiver)
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link projeto
railway link

# 4. Deploy
railway up

# 5. Verificar
railway logs
railway open
```

### Opção 2: Git Push

```bash
# Railway detecta automaticamente pushes em main
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Railway inicia deploy automaticamente
```

---

## 🔍 Verificação Pós-Deploy

### Health Check

```bash
# Via curl
curl https://<seu-app>.railway.app/api/health

# Expected response:
# {"status":"ok","timestamp":"2025-12-02T..."}
```

### API Endpoints

```bash
# Listar medicamentos
curl https://<seu-app>.railway.app/api/items

# Status de autenticação
curl https://<seu-app>.railway.app/api/auth/status
```

### Frontend

```bash
# Acessar no navegador
https://<seu-app>.railway.app

# Deve carregar a página de login PIXLABEL
```

### Database

```bash
# Via Railway CLI
railway run psql $DATABASE_URL

# Verificar tabelas
\dt

# Expected: users, items, orders, sesiPatients, etc.
```

---

## 📊 Monitoramento

### Logs

```bash
# Via CLI
railway logs

# Com filtro
railway logs --filter "ERROR"

# Tempo real
railway logs --follow
```

### Metrics (Railway Dashboard)

- CPU usage
- Memory usage
- Request count
- Response time
- Error rate

### Health Check

- Path: `/api/health`
- Interval: 30s
- Timeout: 10s
- Railway reinicia automaticamente se falhar 3x consecutivas

---

## 🔄 Rollback

### Via CLI

```bash
# Listar deployments
railway deployments

# Rollback para deployment anterior
railway rollback <deployment-id>
```

### Via Dashboard

1. Railway Dashboard > Deployments
2. Selecionar deployment anterior
3. Click "Redeploy"

---

## 🐛 Troubleshooting

### Build Falha

```bash
# Verificar logs
railway logs --deployment <deployment-id>

# Testar build local
npm ci
npm run build

# Verificar railway.toml
cat railway.toml
```

**Solução comum:**
- Verificar `package.json` scripts: `build`, `start`
- Verificar `NODE_ENV=production`
- Limpar cache: `railway up --force`

### Aplicação Não Responde

```bash
# Verificar status
railway status

# Verificar logs de erro
railway logs --filter "ERROR"

# Restart manual
railway restart
```

**Solução comum:**
- Verificar `DATABASE_URL` está configurada
- Verificar porta (Railway usa PORT=3000 ou variável PORT)
- Verificar health check retorna 200

### Database Connection Failed

```bash
# Verificar variável
railway variables

# Testar conexão
railway run psql $DATABASE_URL

# Verificar PostgreSQL está rodando
railway services
```

**Solução comum:**
- Recriar PostgreSQL service
- Verificar `DATABASE_URL` formato correto
- Aplicar migrations: `railway run npm run db:push`

### TypeScript Errors no Build

```bash
# Local check
npm run check

# Se passar local mas falha no Railway:
# - Verificar versão Node.js (deve ser 22)
# - Verificar dependencies vs devDependencies
# - Rebuild: railway up --force
```

---

## 🔐 Segurança

### Environment Variables

✅ **Nunca commitar:**
- `.env` (gitignored)
- `DATABASE_URL`
- `SESSION_SECRET`
- OAuth credentials

✅ **Sempre usar:**
- Railway Variables (encrypted)
- GitHub Secrets (para CI/CD)

### HTTPS

- Railway fornece HTTPS automaticamente
- Certificados SSL gerenciados pela plataforma

### Database

- PostgreSQL com SSL/TLS
- Backups automáticos (Railway)
- Conexões criptografadas

---

## 📈 Performance

### Build Time

- **Expected:** 2-5 minutos
- **Vite build:** ~5s
- **esbuild (backend):** <1s
- **npm install:** 1-4 min

### Response Time

- Health check: <50ms
- API endpoints: 50-200ms
- Frontend (cached): <100ms

### Optimization

```toml
# railway.toml já configurado:
[build.nixpacks]
buildCommand = "npm install && npm run build"

# Caching automático de node_modules
# Artifacts em dist/ persistidos entre builds
```

---

## 🎯 Next Steps

1. **Configurar OAuth**
   - Registrar app no GitHub/Replit
   - Adicionar credentials no Railway

2. **Configurar Monitoring**
   - Sentry para error tracking
   - LogDNA/DataDog para logs
   - Uptime Robot para health checks

3. **Configurar Backups**
   - Railway backups automáticos
   - Considerar backup externo (AWS S3)

4. **Configurar Domain**
   - Adicionar custom domain no Railway
   - Configurar DNS (CNAME)

5. **Load Testing**
   - k6, Artillery ou Apache Bench
   - Validar performance sob carga

---

## 📞 Support

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**PIXLABEL:**
- Repo: https://github.com/jrloopes0-lang/pixlabel
- Issues: https://github.com/jrloopes0-lang/pixlabel/issues
- Docs: `/workspaces/pixlabel/README.md`

---

## ✅ Deploy Checklist Final

Antes de ir para produção:

- [ ] Railway projeto criado
- [ ] PostgreSQL provisionado
- [ ] Variáveis de ambiente configuradas
- [ ] GitHub Actions configurado (RAILWAY_TOKEN)
- [ ] Migrations aplicadas (`npm run db:push`)
- [ ] Health check retornando 200
- [ ] Frontend acessível
- [ ] API endpoints funcionando
- [ ] OAuth configurado (opcional)
- [ ] Monitoring configurado
- [ ] Backups configurados
- [ ] Domain configurado (opcional)

---

**🚀 PIXLABEL está pronto para deploy na Railway!**

**Commit:** 62d8faf  
**Branch:** main  
**Status:** ✅ Production Ready
