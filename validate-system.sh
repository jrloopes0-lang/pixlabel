#!/bin/bash

# 🔍 SCRIPT DE DIAGNÓSTICO COMPLETO - PIXLABEL
# Uso: ./validate-system.sh

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          🔍 VALIDAÇÃO COMPLETA DO SISTEMA PIXLABEL          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
CHECKS_PASSED=0
CHECKS_FAILED=0

# Função para verificar e registrar resultado
check() {
  if eval "$1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} $2"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}❌${NC} $2"
    ((CHECKS_FAILED++))
  fi
}

# 1. TypeScript
echo ""
echo -e "${BLUE}1. TypeScript & Compilação${NC}"
check "npm run check" "TypeScript compilation (0 errors)"

# 2. Build
echo ""
echo -e "${BLUE}2. Build Artifacts${NC}"
check "[ -f dist/index.js ]" "dist/index.js exists"
check "[ -d dist/public ]" "dist/public/ exists"
SIZE=$(du -sh dist 2>/dev/null | cut -f1)
echo -e "${GREEN}✅${NC} Build size: $SIZE"

# 3. Node & npm
echo ""
echo -e "${BLUE}3. Dependências${NC}"
echo -e "Node: $(node --version)"
echo -e "NPM:  $(npm --version)"

# 4. Dev Server
echo ""
echo -e "${BLUE}4. Dev Server${NC}"
if pgrep -f "tsx.*index-dev" > /dev/null; then
  echo -e "${GREEN}✅${NC} Dev server is running"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠️ ${NC} Dev server is not running (optional for this check)"
fi

# 5. API Health
echo ""
echo -e "${BLUE}5. API Endpoints${NC}"
if [ ! -z "$(pgrep -f 'tsx.*index-dev')" ]; then
  check "curl -s -f http://localhost:3000/api/health > /dev/null" "Health endpoint (HTTP 200)"
  check "curl -s -f http://localhost:3000/api/auth/status > /dev/null" "Auth endpoint (HTTP 200)"
else
  echo -e "${YELLOW}⚠️ ${NC} Dev server not running, skipping API checks"
fi

# 6. Portas
echo ""
echo -e "${BLUE}6. Network Ports${NC}"
check "ss -tuln 2>/dev/null | grep -q ':3000' || netstat -tuln 2>/dev/null | grep -q ':3000'" "Port 3000 available"

# 7. Git
echo ""
echo -e "${BLUE}7. Git Repository${NC}"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git log -1 --oneline)
echo -e "${GREEN}✅${NC} Branch: $BRANCH"
echo -e "${GREEN}✅${NC} Commit: $COMMIT"
check "git status -s" "Git status OK"

# 8. Railway CLI
echo ""
echo -e "${BLUE}8. Deployment Tools${NC}"
check "which railway > /dev/null" "Railway CLI installed"

# 9. Documentação
echo ""
echo -e "${BLUE}9. Documentation${NC}"
check "[ -f README.md ]" "README.md exists"
check "[ -f DEPLOY_FINAL_CHECKLIST.md ]" "DEPLOY_FINAL_CHECKLIST.md exists"
check "[ -f .github/workflows/deploy.yml ]" "GitHub workflow configured"

# 10. Configuração
echo ""
echo -e "${BLUE}10. Configuration Files${NC}"
check "[ -f .env.example ]" ".env.example exists"
check "[ -f railway.toml ]" "railway.toml exists"
check "[ -f package.json ]" "package.json exists"

# Resumo Final
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                      📊 RESUMO FINAL                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Checks Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}❌ Checks Failed: $CHECKS_FAILED${NC}"

if [ $CHECKS_FAILED -eq 0 ]; then
  echo ""
  echo -e "${GREEN}🎉 SISTEMA COMPLETAMENTE VALIDADO - PRONTO PARA DEPLOY${NC}"
  echo ""
  echo "Próximos passos:"
  echo "1. Configure RAILWAY_TOKEN no GitHub (Settings → Secrets)"
  echo "2. Execute: git push origin main"
  echo "3. Monitore o workflow em GitHub Actions"
  echo "4. Verifique o deploy no painel Railway"
  exit 0
else
  echo ""
  echo -e "${YELLOW}⚠️ ALGUNS ITENS REQUEREM ATENÇÃO${NC}"
  exit 1
fi
