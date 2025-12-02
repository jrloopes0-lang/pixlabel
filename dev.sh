#!/bin/bash
# PIXLABEL – Quick Start Script (FASE 2)

echo "🚀 PIXLABEL – Dev Server Launcher"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env não encontrado. Criando com valores de exemplo..."
    cp .env.example .env 2>/dev/null || {
        echo "DATABASE_URL=postgresql://test:test@localhost:5432/pixlabel_dev" > .env
        echo "SESSION_SECRET=dev-secret-key" >> .env
        echo "NODE_ENV=development" >> .env
    }
    echo "✅ .env criado. Edite com suas variáveis reais."
fi

echo ""
echo "📋 Verificando requisitos..."
echo ""

# Check Node version
NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

# Check npm
NPM_VERSION=$(npm --version)
echo "✅ npm: $NPM_VERSION"

# Check TypeScript
echo "🔍 Verificando TypeScript..."
npm run check --silent > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ TypeScript: Zero errors"
else
    echo "⚠️  TypeScript: Alguns erros detectados"
    npm run check
    exit 1
fi

echo ""
echo "🎯 Iniciando dev server..."
echo "=================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "API:       http://localhost:3000/api/*"
echo "Health:    http://localhost:3000/api/health"
echo "WebSocket: ws://localhost:5173 (Vite HMR)"
echo ""
echo "Pressione Ctrl+C para parar"
echo "=================================="
echo ""

# Start dev server with env vars
export $(cat .env | grep -v '^#' | xargs)
npm run dev
