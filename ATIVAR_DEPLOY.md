# 🔐 ATIVAR RAILWAY DEPLOY - GUIA PASSO A PASSO

## ⚠️ SITUAÇÃO ATUAL

```
✅ Código:        100% pronto e testado
✅ Build:         Gerado com sucesso
✅ Tests:         Passando
✅ Workflows:     Configurados no GitHub
⏳ Deploy:        BLOQUEADO - Falta RAILWAY_TOKEN
```

---

## 🎯 O QUE PRECISA SER FEITO

### Você tem 3 opções:

#### **Opção 1: Configurar Secret via GitHub Web (RECOMENDADO)**

1. **Abra o link** (no navegador):
   ```
   https://github.com/jrloopes0-lang/pixlabel/settings/secrets/actions
   ```

2. **Clique em "New repository secret"** (botão verde)

3. **Preencha os dados**:
   - **Name**: `RAILWAY_TOKEN`
   - **Secret**: Cole seu token do Railway aqui
   
4. **Clique "Add secret"**

5. **Confirme via email** (GitHub enviará código de verificação)

6. **Pronto!** Faça um novo push:
   ```bash
   git push origin main
   ```

---

#### **Opção 2: Configurar via GitHub CLI (Local)**

```bash
# 1. Instale GitHub CLI (se não tiver)
# macOS:
brew install gh

# Linux:
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 2. Faça login
gh auth login

# 3. Adicione o secret
gh secret set RAILWAY_TOKEN --body "seu-token-aqui" --repo jrloopes0-lang/pixlabel

# 4. Confirme com email quando solicitado
```

---

#### **Opção 3: Fazer Push com RAILWAY_TOKEN na Linha de Comando**

```bash
# 1. Defina o token como variável de ambiente
export RAILWAY_TOKEN="seu-token-aqui"

# 2. Ou configure globalmente em ~/.bashrc ou ~/.zshrc
echo 'export RAILWAY_TOKEN="seu-token-aqui"' >> ~/.bashrc
source ~/.bashrc

# 3. Faça push normalmente
cd /workspaces/pixlabel
git push origin main

# O GitHub Actions usará a variável automaticamente
```

---

## 🚀 APÓS CONFIGURAR O SECRET

### Próximo passo automático:

```
git push origin main
    ↓
GitHub Actions ativa automaticamente
    ↓
Quality Checks (TypeScript, testes)
    ↓
Build geração
    ↓
Deploy para Railway
    ↓
App online em https://pixlabel.railway.app
```

---

## 🔑 ONDE OBTER O TOKEN RAILWAY

Se ainda não tem o token, siga:

### Via CLI Railway:
```bash
# 1. Login
railway login

# 2. Pega o token
railway token

# 3. Copie o token que aparecer
```

### Via Dashboard Railway:
1. Acesse: https://railway.app
2. Vá para: Settings → Tokens
3. Clique em "New Token"
4. Selecione seu projeto (pixlabel)
5. Copie o token gerado

---

## ✅ CHECKLIST FINAL

- [ ] GitHub Secret RAILWAY_TOKEN adicionado
- [ ] Verificação de 2FA confirmada
- [ ] Token válido (começa com `rw_` ou similar)
- [ ] Git push executado (`git push origin main`)
- [ ] GitHub Actions workflow acionado
- [ ] Workflow terminando com sucesso
- [ ] Railway dashboard mostrando novo deploy
- [ ] App online em https://pixlabel.railway.app
- [ ] Health check retorna HTTP 200 (`/api/health`)

---

## 🆘 SE ALGO DER ERRADO

### Erro: "Permission denied" no GitHub
**Solução**: Verifique se você tem permissão no repositório (deve ser admin/owner)

### Erro: "Invalid token"
**Solução**: Railway token pode ter expirado. Gere um novo em railway.app/settings/tokens

### Erro: "2FA verification failed"
**Solução**: Verifique seu email e código 2FA, tente novamente

### Erro: "No such file or directory .env"
**Solução**: Railway precisa de DATABASE_URL. Adicione no Railway dashboard:
```
NODE_ENV=production
VITE_API_BASE_URL=https://seu-app.railway.app
DATABASE_URL=postgresql://... (se usando Neon)
```

### Workflow rodando mas não faz deploy
**Solução**: Verifique logs em: https://github.com/jrloopes0-lang/pixlabel/actions

---

## 📊 TIMELINE ESPERADA

```
T+0:00   → Você adiciona RAILWAY_TOKEN no GitHub
T+0:05   → Você faz git push origin main
T+0:10   → GitHub Actions inicia workflow
T+0:20   → Quality checks (TypeScript, testes)
T+0:30   → Build geração (npm run build)
T+0:40   → Deploy para Railway
T+1:00   → App online e funcional
T+1:30   → Database migrations (npm run db:push)
T+2:00   → ✅ Sistema 100% operacional
```

---

## 🎯 APÓS DEPLOY - PRÓXIMOS PASSOS

1. **Acesse a aplicação**:
   ```
   https://pixlabel.railway.app
   ```

2. **Teste health check**:
   ```bash
   curl https://pixlabel.railway.app/api/health
   ```

3. **Configure DATABASE** (se usando Neon):
   ```bash
   # No Railway dashboard, configure:
   DATABASE_URL=postgresql://user:pass@host:port/db
   ```

4. **Execute migrations**:
   ```bash
   railway run npm run db:push
   ```

5. **Teste endpoints**:
   ```bash
   curl https://seu-app.railway.app/api/items
   curl https://seu-app.railway.app/api/sesi/pacientes
   ```

---

## 📞 CONTATO & SUPORTE

Se tiver dúvidas:
1. Verifique logs do GitHub Actions
2. Veja logs do Railway: `railway logs`
3. Consulte DEPLOY_FINAL_CHECKLIST.md
4. Revise RAILWAY_DEPLOY.md

---

**Status**: ⏳ Aguardando configuração de RAILWAY_TOKEN  
**Próximo**: Configure secret → git push → Deploy automático  
**Tempo estimado**: 5-10 minutos  
**Commit**: 46dbf5c  
**Data**: 2 de dezembro de 2025
