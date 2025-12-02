# FASE 4: Production OAuth & Deployment Guide

## 1. Production OAuth Setup (Genérico)

### Pré-requisitos
- Conta no provedor OAuth desejado (GitHub, Keycloak, Google, etc)
- Acesso ao painel de desenvolvedor do provider

### Passos

#### 1.1. Registrar OAuth App no Provider

1. Ir para o painel do provider (ex: https://github.com/settings/developers, https://keycloak.example.com)
2. Criar novo OAuth Application
3. Preencher formulário:
   - **Name**: PIXLABEL
   - **Description**: Sistema de Gestão Farmacêutica para Saúde Pública
   - **Redirect URI**: `http://localhost:3000/auth/callback` (desenvolvimento)
   - **Redirect URI**: `https://seu-dominio.com/auth/callback` (produção)
   - **Scopes**: conforme provider (ex: `email`, `profile`)
4. Salvar e copiar:
   - Client ID
   - Client Secret
   - URLs de autorização, token e userinfo

#### 1.2. Configurar Variáveis de Ambiente

```bash
# Development (.env.local)
OAUTH_PROVIDER_NAME=github # ou keycloak, google, etc
OAUTH_AUTH_URL=https://provider.example.com/oauth/authorize
OAUTH_TOKEN_URL=https://provider.example.com/oauth/token
OAUTH_USERINFO_URL=https://provider.example.com/oauth/userinfo
OAUTH_CLIENT_ID=seu-client-id
OAUTH_CLIENT_SECRET=seu-client-secret
OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback
NODE_ENV=development

# Production (.env.production)
OAUTH_PROVIDER_NAME=github
OAUTH_AUTH_URL=https://provider.example.com/oauth/authorize
OAUTH_TOKEN_URL=https://provider.example.com/oauth/token
OAUTH_USERINFO_URL=https://provider.example.com/oauth/userinfo
OAUTH_CLIENT_ID=seu-client-id
OAUTH_CLIENT_SECRET=seu-client-secret
OAUTH_CALLBACK_URL=https://pixlabel.seudominio.com/auth/callback
NODE_ENV=production
```

#### 1.3. Implementar em server/index-dev.ts

```typescript
import passport from 'passport';
import { createOAuthStrategy } from './oauth/provider';

const app = express();

// Configurar Passport
passport.use(
  process.env.OAUTH_PROVIDER_NAME || 'oauth',
  createOAuthStrategy(
    process.env.OAUTH_AUTH_URL,
    process.env.OAUTH_TOKEN_URL,
    process.env.OAUTH_USERINFO_URL,
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_CALLBACK_URL,
    process.env.OAUTH_PROVIDER_NAME || 'oauth'
  )
);

// Serialize/Deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  // TODO: Buscar user do DB
  done(null, { id });
});

// Middleware
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.get('/auth/login', passport.authenticate(process.env.OAUTH_PROVIDER_NAME || 'oauth'));
app.get(
  '/auth/callback',
  passport.authenticate(process.env.OAUTH_PROVIDER_NAME || 'oauth', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);
```

### 2. Testing Production OAuth

#### 2.1. Local Testing

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Testar endpoints
curl http://localhost:3000/auth/login
curl http://localhost:3000/auth/status
curl http://localhost:3000/auth/logout
```

#### 2.2. E2E Tests com Playwright

```bash
# Rodar testes E2E
npm run test:e2e

# Com UI interativa
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Headed (ver browser)
npm run test:e2e:headed
```

#### 2.3. Verificar Auditlog

```bash
# Após login/logout, verificar auditlog
curl http://localhost:3000/api/auditLogs \
  -H "Authorization: Bearer <token>"
```

### 3. Deployment Options

#### Option 1: Deploy Independente (Docker, Railway, VPS, etc)

**Vantagens:**
- Total independência de plataforma
- Suporte a qualquer provider OAuth
- Controle total do ambiente

**Passos:**
1. Criar repo GitHub
2. Configurar CI/CD (GitHub Actions, Railway, VPS, etc)
3. Configurar DATABASE_URL e variáveis OAUTH_* no ambiente
4. Build e deploy automático

#### Option 2: Railway.app

**Vantagens:**
- PostgreSQL integrado
- GitHub integration
- Ambiente staging/production

**Passos:**
1. Criar projeto em railway.app
2. Conectar repo GitHub
3. Configurar variáveis de ambiente
4. Deploy automático em push

**Arquivo railway.toml:**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
```

#### Option 3: Docker + Qualquer Provider

**Dockerfile:**
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**Build & Deploy:**
```bash
docker build -t pixlabel:latest .
docker run -e DATABASE_URL=... -e SESSION_SECRET=... -p 3000:3000 pixlabel:latest
```

### 4. Security Checklist

- [ ] HTTPS/TLS ativado (produção)
- [ ] Rate limiting ativado (via middleware/security.ts)
- [ ] CSRF protection ativado
- [ ] Headers de segurança configurados (Helmet)
- [ ] Logs de auditoria ativados
- [ ] LGPD consent flow implementado
- [ ] Criptografia de CPF (TODO)
- [ ] Secrets não commitados (.env)
- [ ] CORS restrito (apenas origem autorizada)

### 5. Performance Checklist

- [ ] Vite build otimizado
- [ ] React Query cache configurado
- [ ] Índices de DB criados
- [ ] CDN para assets estáticos
- [ ] Compressão gzip/brotli

### 6. Monitoring & Logging

#### Application Logging
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
  },
});

export default logger;
```

#### Error Tracking (Sentry)
```bash
npm install @sentry/node
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### Database Monitoring
- Usar Neon dashboard para queries lentas
- Ativar slow query log em produção
- Monitorar conexão pool

### 7. Disaster Recovery

#### Backup Strategy
```bash
# Backup PostgreSQL via Neon
pg_dump \
  postgres://user:pass@neon.tech/db > backup.sql

# Restaurar
psql postgres://user:pass@neon.tech/db < backup.sql
```

#### Health Checks
```typescript
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected', // TODO: verificar DB
  };
  res.json(health);
});
```

### 8. Next Steps After Deploy

1. **Verificar:**
   - [ ] App accessible via HTTPS
   - [ ] OAuth flow funcionando
   - [ ] Database conectada
   - [ ] Emails de notificação configurados

2. **Notificar:**
   - [ ] Usuários sobre lançamento
   - [ ] Feedback via GitHub Discussions
   - [ ] Monitore logs para erros

3. **Maintenance:**
   - [ ] Backups diários
   - [ ] Monitorar performance
   - [ ] Atualizações de segurança
   - [ ] Planejar FASE 5 (features adicionais)

---

## Troubleshooting

### OAuth Redirect Not Working
```
Solução: Verificar OAUTH_CALLBACK_URL no .env
```

### Database Connection Error
```
Solução: Verificar DATABASE_URL e firewall rules
```

### Rate Limiting Muito Restritivo
```
Solução: Ajustar max/windowMs em security.ts
```

### E2E Tests Falhando
```bash
# Debug
npm run test:e2e:debug

# Headed (visualizar)
npm run test:e2e:headed

# Específico
npm run test:e2e -- --grep "should login"
```

---

**Status**: FASE 4 - Production Ready  
**Última Atualização**: December 1, 2025  
**Próxima Fase**: FASE 5 - Features Adicionais & Otimização
