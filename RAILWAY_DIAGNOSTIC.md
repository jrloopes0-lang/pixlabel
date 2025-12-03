# 🚀 RAILWAY DEPLOYMENT DIAGNOSTIC

## Status Local: ✅ FUNCIONANDO

- Health Check: `GET /api/health` → **200 OK**
- Frontend: `GET /` → **index.html served**
- Static Files: `/assets/index-*.js` → **Found**
- Build: **Complete** (32.4 kB backend + 315.77 kB frontend JS)

---

## 📋 Checklist: Por que o site não abre no Railway?

### 1️⃣ Verificar Logs no Railway

**Acesse:**
- Railway Dashboard → Projeto PIXLABEL → Serviço Node → **Logs**

**Procure por:**
- ✅ `✅ PIXLABEL Production Server Started` – se aparecer, servidor subiu
- ❌ `❌ Error`, `Error:`, `ENOENT` – erros de arquivo ou inicialização
- ⚠️ `PORT`, `HOST` – valores corretos?
- 💾 `Database` – mostra status de conexão

**Se ver erro, copie e cole aqui para debug.**

---

### 2️⃣ Testar Health Check do Railway

Via navegador ou curl:
```bash
curl https://seu-app.railway.app/api/health
```

**Esperado:**
```json
{"status":"ok","timestamp":"2025-12-03T...","environment":"production"}
```

**Se falhar:**
- Aplicação não está rodando
- Porta errada
- Pode ser tempo limite de startup

---

### 3️⃣ Verificar Variáveis de Ambiente no Railway

No Dashboard:
- Serviço Node → **Variables**
- Procure por:
  - `DATABASE_URL` – deve ter o valor da Railway (`${{ Postgres-YY2Z.DATABASE_URL }}`)
  - `NODE_ENV` – deve ser `production`
  - `PORT` – pode estar vazio (padrão 3000) ou setado
  - `HOST` – deve ser `0.0.0.0`

**Se `DATABASE_URL` não existir:**
1. Clique em **Add Variable**
2. Nome: `DATABASE_URL`
3. Valor: `${{ Postgres-YY2Z.DATABASE_URL }}`
4. Salve
5. **Redeploy** o serviço

---

### 4️⃣ Verificar Build Logs

No Railway Dashboard:
- Serviço Node → **Deployments** → Clique no último deploy

**Procure por:**
- ✅ `npm ci` – dependências instaladas
- ✅ `npm run build` – Vite e esbuild rodaram
- ❌ `Error during build` – build falhou

---

### 5️⃣ Verificar Status da Porta

Railway deve expor automaticamente a porta 3000 (ou a que estiver em `$PORT`).

**Seu app deve estar em:**
```
https://seu-app.railway.app
```

Se ver "Application Error" ou "504 Gateway Timeout", significa:
- Servidor não responde
- Demora >30s para iniciar

---

### 6️⃣ Verificar se o Build foi commitado

No GitHub, verifique se `dist/` foi incluído:
```bash
cd /Users/juniorlopes/Documents/GitHub/pixlabel
git ls-files | grep dist/
```

**Se estiver vazio (não aparecer `dist/index.js`), rode:**
```bash
git add dist/
git commit -m "include dist build artifacts"
git push origin main
```

---

## 🔧 Soluções Rápidas

### Problema: "Application Error"
**Solução:**
1. Verifique `DATABASE_URL` está setada (Step 3 acima)
2. Redeploy: Railway Dashboard → Serviço Node → **Redeploy**
3. Aguarde 2-3 minutos

### Problema: "504 Gateway Timeout"
**Solução:**
1. Servidor demorando muito para iniciar
2. Possível: tentando conectar ao DB e travando
3. Verifique logs (Step 1)

### Problema: "Cannot GET /"
**Solução:**
1. Frontend não está sendo servido
2. Verifique se `dist/public/index.html` existe localmente:
   ```bash
   ls -lah dist/public/index.html
   ```
3. Se não existir, rode `npm run build` e faça commit

---

## 📞 Próximos Passos

1. **Verifique os logs no Railway** (Step 1)
2. **Teste o health check** (Step 2)
3. **Resete o DATABASE_URL** se necessário (Step 3)
4. **Se continuar não abrindo, copie os erros dos logs aqui**

---

**Data**: 3 de dezembro de 2025  
**Versão**: 1.0  
**Status**: Servidor local validado ✅
