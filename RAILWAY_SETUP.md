# 🚂 PIXLABEL - Railway Deployment Guide

**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Branch:** main

---

## 🎯 Overview

This guide will help you deploy PIXLABEL to Railway with PostgreSQL database.

### Architecture on Railway

```
GitHub (main branch)
    ↓ (auto-deploy)
Railway Platform
    ├── Web Service (Node.js)
    │   ├── Build: npm ci && npm run build
    │   ├── Start: npm start
    │   └── Health: /api/health
    └── PostgreSQL Database
        └── Automatically provisioned & configured
```

---

## 📋 Prerequisites

- GitHub account with access to the repository
- Railway account (free tier works)
- Basic understanding of environment variables

---

## 🚀 Step-by-Step Deployment

### 1. Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `jrloopes0-lang/pixlabel`

### 2. Add PostgreSQL Database

1. In your Railway project dashboard
2. Click "+ New" → "Database" → "Add PostgreSQL"
3. Railway will automatically:
   - Provision a PostgreSQL instance
   - Create `DATABASE_URL` environment variable
   - Link it to your web service

### 3. Configure Environment Variables

Go to your web service → "Variables" tab and add:

```bash
# Required
NODE_ENV=production
SESSION_SECRET=<generate-random-secret>

# Optional: OAuth (if needed)
OAUTH_PROVIDER_NAME=github
OAUTH_CLIENT_ID=<your-github-oauth-client-id>
OAUTH_CLIENT_SECRET=<your-github-oauth-client-secret>
OAUTH_AUTH_URL=https://github.com/login/oauth/authorize
OAUTH_TOKEN_URL=https://github.com/login/oauth/access_token
OAUTH_USERINFO_URL=https://api.github.com/user
OAUTH_CALLBACK_URL=https://<your-app>.railway.app/auth/callback
```

**Generate SESSION_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Configure Build Settings

Railway automatically detects the configuration from `railway.toml`:

```toml
[build]
builder = "nixpacks"

[build.nixpacks]
node = "20"
buildCommand = "npm ci && npm run build"

[deploy]
startCommand = "NODE_ENV=production node dist/index.js"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[healthcheck]
enabled = true
path = "/api/health"
timeout = 5
interval = 15
```

No manual configuration needed!

### 5. Initialize Database

After first deploy, run migrations:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database initialization
railway run npm run db:init

# Alternative: use db:push for schema sync
railway run npm run db:push
```

### 6. Verify Deployment

1. **Check Health:**
   ```bash
   curl https://your-app.railway.app/api/health
   ```
   Expected: `{"status":"ok","timestamp":"..."}`

2. **Check Frontend:**
   Open `https://your-app.railway.app` in browser
   - Should show PixelLab home page

3. **Check API:**
   ```bash
   curl -H "x-demo-token: demo-pixlabel-test" \
        https://your-app.railway.app/api/auth/status
   ```

---

## 🔍 Monitoring & Logs

### View Logs

```bash
# Via CLI
railway logs

# Via Dashboard
Go to your service → "Deployments" → Click latest deployment → "View Logs"
```

### Common Log Patterns

**✅ Successful Start:**
```
✅ Database connected via Drizzle ORM (Neon Serverless)
📊 Database: <your-db-host>
Server Status: ✅ STARTED
URL: http://0.0.0.0:3000
```

**❌ Database Connection Failed:**
```
❌ Database connection failed: <error>
⚠️ Falling back to in-memory storage
```
→ Check DATABASE_URL variable is set correctly

**❌ Build Failed:**
```
❌ Error: Cannot find module ...
```
→ Check package.json dependencies are complete

---

## 🐛 Troubleshooting

### Issue: App Shows 502 Bad Gateway

**Cause:** Server failed to start or bind to PORT

**Solution:**
1. Check logs: `railway logs`
2. Verify environment variables are set
3. Check `dist/index.js` was created during build
4. Restart: `railway restart`

### Issue: Database Connection Error

**Cause:** DATABASE_URL not configured or invalid

**Solution:**
1. Verify PostgreSQL service is running
2. Check DATABASE_URL variable exists
3. Test connection:
   ```bash
   railway run psql $DATABASE_URL
   ```

### Issue: Health Check Failing

**Cause:** `/api/health` endpoint not responding

**Solution:**
1. Check server logs for startup errors
2. Verify routes are loaded correctly
3. Test locally: `npm run build && npm start`

### Issue: Build Takes Too Long

**Cause:** Node.js dependencies installation

**Solution:**
- Railway caches `node_modules` between builds
- First build may take 3-5 minutes
- Subsequent builds: 1-2 minutes

---

## 🔐 Security Checklist

Before going to production:

- [ ] Change SESSION_SECRET to a strong random value
- [ ] Configure OAuth provider properly (if using)
- [ ] Set NODE_ENV=production
- [ ] Enable Railway's built-in DDoS protection
- [ ] Set up custom domain with HTTPS
- [ ] Enable database backups (Railway Pro)
- [ ] Review audit logs configuration
- [ ] Test rate limiting is active

---

## 📊 Performance Optimization

### Railway Configuration

**Recommended Plan:** Hobby ($5/month)
- 512 MB RAM
- 1 vCPU
- 100 GB bandwidth

**For Production:** Pro ($20/month)
- 8 GB RAM
- 8 vCPU
- Unlimited bandwidth
- Priority support

### Build Optimization

Railway automatically:
- Caches dependencies
- Uses esbuild for backend bundling
- Serves static assets with compression

### Database Optimization

**Connection Pooling:**
Already configured via Neon serverless driver (HTTP-based, no persistent connections)

**Indexes:**
All critical columns have indexes (see `shared/schema.ts`)

---

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/railway.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run check
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --ci
```

**Setup:**
1. Get Railway token: https://railway.app/account/tokens
2. Add to GitHub: Settings → Secrets → New secret
   - Name: `RAILWAY_TOKEN`
   - Value: <your-token>

---

## 📈 Scaling

### Horizontal Scaling

Railway doesn't support horizontal scaling directly, but you can:

1. **Use Redis for sessions** (instead of in-memory)
2. **Add load balancer** (Railway Pro)
3. **Deploy to multiple regions** (Railway Pro)

### Vertical Scaling

Increase resources in Railway dashboard:
- Settings → Resources
- Adjust memory/CPU as needed

---

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] Test health check: `https://your-app.railway.app/api/health`
- [ ] Test authentication flow
- [ ] Test CRUD operations on items
- [ ] Test SESI dispensation flow
- [ ] Verify database persistence
- [ ] Check audit logs are created
- [ ] Monitor error rates in Railway dashboard
- [ ] Set up alerts for downtime (Railway Pro)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring (Sentry, LogDNA, etc.)

---

## 📞 Support

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**PIXLABEL:**
- GitHub: https://github.com/jrloopes0-lang/pixlabel
- Issues: https://github.com/jrloopes0-lang/pixlabel/issues

---

## 🎉 Success!

Your PIXLABEL instance should now be running on Railway!

**Next Steps:**
1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure backups
4. Add custom domain
5. Invite users

**Access your app:**
```
https://your-app.railway.app
```

---

**Deployed with ❤️ using Railway Platform**
