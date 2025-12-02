# 🚀 DEPLOYMENT GUIDE – PIXLABEL

**Status:** FASE 2 – Pronto para deployment em desenvolvimento/produção  
**Data:** 1º de dezembro de 2025

---

## 📋 Pré-requisitos

- [x] Node.js 20+
- [x] npm ou yarn
- [x] PostgreSQL 15+ (ou Neon serverless)
- [x] Git
- [x] (Opcional) Docker

---

## 🏁 Deployment Local (Development)

### 1. Setup

```bash
# Clone
git clone https://github.com/pixlabel/pixlabel.git
cd pixlabel

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env com DATABASE_URL e SESSION_SECRET
nano .env  # or your editor
```

### 2. Database Setup

#### Opção A: PostgreSQL Local
```bash
# Create database
createdb pixlabel_dev

# Set DATABASE_URL
export DATABASE_URL="postgresql://localhost/pixlabel_dev"

# Apply migrations
npm run db:push
```

#### Opção B: Neon (Serverless – Recomendado)
```bash
# 1. Sign up: https://console.neon.tech
# 2. Create project
# 3. Copy connection string
# 4. Set in .env
DATABASE_URL=postgresql://user:password@xyz.neon.tech:5432/pixlabel

# Apply migrations
npm run db:push
```

### 3. Start Dev Server

```bash
npm run dev
# Access: http://localhost:3000
```

---

## 🏢 Deployment Production

### Option 1: Replit (Recommended for MVP)

**Advantages:**
- One-click deployment
- Built-in PostgreSQL (optional)
- Free tier available
- Perfect for Brazilian startups

**Steps:**
```bash
# 1. Create account on replit.com
# 2. Click "Create Replit from GitHub"
# 3. Select pixlabel repo
# 4. Configure secrets (Settings → Secrets):
#    - DATABASE_URL=postgresql://...
#    - SESSION_SECRET=random-secret
# 5. Replit auto-detects npm + runs `npm run dev`
# 6. Share public URL
```

### Option 2: Vercel (Frontend) + Heroku/Railway (Backend)

**Advantages:**
- Scalable
- CDN for frontend
- Good for larger deployments

**Steps:**

**Frontend (Vercel):**
```bash
# 1. Push to GitHub
# 2. Connect repo to Vercel
# 3. Set build command: npm run build
# 4. Set output directory: dist/public
# 5. Deploy
```

**Backend (Railway/Heroku):**
```bash
# 1. Create account on railway.app or heroku.com
# 2. Connect GitHub repo
# 3. Add PostgreSQL add-on
# 4. Set environment variables:
#    - DATABASE_URL (auto from add-on)
#    - SESSION_SECRET
#    - NODE_ENV=production
# 5. Set start command: npm start
# 6. Deploy
```

### Option 3: Docker (Any Cloud)

**Advantages:**
- Consistent environment
- Cloud-agnostic (AWS, GCP, Azure, DigitalOcean)

**Setup:**

Create `Dockerfile`:
```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build frontend
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
```

Create `.dockerignore`:
```
node_modules
.env
.git
dist
```

**Build & Run:**
```bash
# Build
docker build -t pixlabel:latest .

# Run locally
docker run -e DATABASE_URL="postgresql://..." \
           -e SESSION_SECRET="secret" \
           -p 3000:3000 pixlabel:latest

# Push to registry
docker tag pixlabel:latest myrepo/pixlabel:latest
docker push myrepo/pixlabel:latest

# Deploy to any cloud (AWS ECS, GKE, etc.)
```

---

## ⚙️ Environment Variables (Production)

```bash
# Database (REQUIRED)
DATABASE_URL=postgresql://user:pass@host:port/db

# Session (REQUIRED)
SESSION_SECRET=your-very-secure-random-string

# App
NODE_ENV=production
PORT=3000  # optional, defaults to 3000

# Replit OIDC (if using Replit auth)
REPL_ID=your-replit-id

# Optional
PERPLEXITY_API_KEY=xxx
```

**🔒 Security Tips:**
- Never commit `.env` to git
- Use secret management tools (Replit Secrets, AWS Secrets Manager, etc.)
- Rotate SESSION_SECRET periodically
- Use strong DATABASE_URL credentials
- Enable SSL for database connections

---

## 📊 Scaling Considerations

### Single Server (Current – Good for MVP)
```
Frontend (React) + Backend (Express) → PostgreSQL
Port 3000 (Vite middleware serves both)
```

**Limits:** ~100-200 concurrent users

**When to scale:** Traffic > 1000 users/day

### Microservices (When Needed)

**Stage 1: Separate Frontend**
```
Frontend (Vercel)  ──→ Backend API (Railway) ──→ PostgreSQL
```
Add CORS config in Express.

**Stage 2: Add Cache Layer**
```
Frontend ──→ Redis Cache ──→ Backend ──→ PostgreSQL
```

**Stage 3: Database Read Replicas**
```
Frontend ──→ Backend ──→ PostgreSQL (Primary + Replicas)
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm ci
      - run: npm run check  # TypeScript
      # - run: npm test     # Add when tests exist

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Replit
        env:
          REPLIT_TOKEN: ${{ secrets.REPLIT_TOKEN }}
        run: |
          # Deploy script (depends on your platform)
          echo "Deploying to Replit..."
```

---

## 🔍 Monitoring & Logs

### Local Development
```bash
# Terminal 1: Backend logs
npm run dev

# Terminal 2: View database
npm run db:studio
```

### Production (Replit)
```
Dashboard → Logs → View output
```

### Production (Docker)
```bash
# View logs
docker logs container_id

# Follow logs
docker logs -f container_id
```

---

## 📈 Performance Optimization

### Frontend
```bash
# Check build size
npm run build
ls -lh dist/

# Analyze
npm install -D @vite-plugin-visualizer/rollup-plugin
# Add plugin to vite.config.ts
```

### Backend
```bash
# Database indexes (already set in schema.ts)
# Check query performance:
npm run db:studio

# Add caching headers (TODO)
```

---

## 🚨 Disaster Recovery

### Backup Database
```bash
# PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql

# Automated (Neon backup)
# Dashboard → Backups → Enable automatic backups
```

### Rollback
```bash
# If deployment breaks
git revert HEAD
git push origin main
# Redeploy from previous version
```

---

## ✅ Pre-Launch Checklist

- [ ] Type check passes: `npm run check`
- [ ] Dev server starts: `npm run dev`
- [ ] API health check: `curl http://localhost:3000/api/health`
- [ ] Database connected: `npm run db:studio` (accessible)
- [ ] .env.example updated with all vars
- [ ] .gitignore includes .env
- [ ] README.md complete
- [ ] LICENSE file present
- [ ] Git history clean (no secrets committed)
- [ ] GitHub repo public/private as needed

---

## 📞 Support

### Common Issues

**Port 3000 already in use:**
```bash
# Kill process
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

**DATABASE_URL not set:**
```bash
# Check
echo $DATABASE_URL

# Set
export DATABASE_URL="postgresql://..."
```

**Migrations fail:**
```bash
# Reset (WARNING: deletes all data)
npm run db:push:force

# Check migrations
npm run db:studio
```

---

## 🎯 Next Steps

1. **Choose deployment platform** (Replit recommended for MVP)
2. **Configure environment variables**
3. **Test locally** (`npm run dev`)
4. **Deploy** (follow platform-specific guide)
5. **Monitor logs** and performance
6. **Set up CI/CD** (GitHub Actions)
7. **Plan scaling** (when needed)

---

## 📚 References

- **Replit Deployment:** https://replit.com/nix
- **Neon PostgreSQL:** https://console.neon.tech
- **Docker Hub:** https://hub.docker.com
- **Railway:** https://railway.app
- **Vercel:** https://vercel.com
- **GitHub Actions:** https://github.com/features/actions

---

**Last Updated:** Dec 1, 2025  
**Status:** Ready for MVP deployment ✅
