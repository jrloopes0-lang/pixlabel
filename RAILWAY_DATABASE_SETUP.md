# 🚀 Railway Database Setup – Checklist de Implementação

## Status: ⏳ Pronto para Configurar

Este documento descreve exatamente como conectar o PIXLABEL ao Postgres-YY2Z na Railway e sincronizar o schema.

---

## 1️⃣ Obter DATABASE_URL do Railway

1. Acesse o **Railway Dashboard** → Projeto **PIXLABEL**.
2. Clique no serviço **Postgres-YY2Z**.
3. Abra a aba **Connect**.
4. Copie a string `DATABASE_URL` completa (inicia com `postgresql://`).

**Exemplo:**
```
postgresql://postgres:abc123def456@monorail.proxy.rlwy.net:5432/railway
```

---

## 2️⃣ Configurar DATABASE_URL Localmente (Seu Mac)

No seu terminal, na pasta do projeto:

```bash
cd /Users/juniorlopes/Documents/GitHub/pixlabel
```

Edite o arquivo `.env` (já existe na raiz) e descomente/atualize a linha:

```dotenv
# Antes (comentado):
# DATABASE_URL=postgresql://user:password@host:5432/railway

# Depois (descomentado com a URL real do Railway):
DATABASE_URL=postgresql://postgres:abc123def456@monorail.proxy.rlwy.net:5432/railway
```

---

## 3️⃣ Sincronizar Schema com o Banco (db:push)

Agora que `DATABASE_URL` aponta para o Postgres do Railway, rode:

```bash
npm run db:push
```

Isso:
- Lê o schema em `shared/schema.ts`.
- Cria/atualiza as 14 tabelas no Postgres-YY2Z.
- Mostra mensagens de sucesso tipo `✅ Schema pushed successfully`.

**Se der erro:**
- Verifique que a URL está correta (copy-paste exato do Railway).
- Confira que sua máquina consegue acessar o banco (firewall, VPN, etc.).
- Copie o erro aqui se persistir.

---

## 4️⃣ Configurar DATABASE_URL no Railway (Serviço Node/Express)

1. No Dashboard da Railway, clique no **serviço Node.js** (aquele que roda `npm run build` e `NODE_ENV=production node dist/index.js`).
2. Vá em **Variables** (ou **Environment**).
3. Crie uma **nova variável**:
   - **Nome:** `DATABASE_URL`
   - **Valor:** `${{ Postgres-YY2Z.DATABASE_URL }}`
   
   (A sintaxe `${{ ... }}` faz o Railway puxar automaticamente a URL do serviço Postgres-YY2Z.)

4. Clique **Save** (ou equivalente).
5. Clique **Redeploy** para o serviço Node subir novamente com essa variável.

---

## 5️⃣ Validar Sincronização

Após o deploy terminar no Railway:

1. Abra o Railway Dashboard → Serviço Node.
2. Vá em **Logs** e procure por mensagens tipo:
   ```
   ✅ Database connected via Drizzle ORM (Neon HTTP)
   ```
   ou
   ```
   ⚠️ DATABASE_URL não configurada. Usando fallback em memória...
   ```

   Se ver a primeira mensagem, **banco está conectado**. ✅

3. Na aba **Network** do seu navegador, teste uma rota que acessa o DB:
   - Ex.: `GET https://seu-app.railway.app/api/items` (deve retornar dados/estrutura JSON).

---

## 6️⃣ Código Já Pronto

✅ **Não precisa modificar nada no código:**
- `drizzle.config.ts` – já lê `DATABASE_URL`.
- `server/db.ts` – já conecta via Drizzle ORM com `DATABASE_URL`.
- `server/index-prod.ts` – já não tenta conectar ao DB se não for necessário (fallback em memória).

---

## 📋 Resumo Rápido (TL;DR)

| Etapa | Ação |
|-------|------|
| 1 | Copie `DATABASE_URL` do Postgres-YY2Z na Railway. |
| 2 | Cole no `.env` local (`DATABASE_URL=postgresql://...`). |
| 3 | Rode `npm run db:push` para sincronizar schema. |
| 4 | No Railway, adicione var **`DATABASE_URL`** = `${{ Postgres-YY2Z.DATABASE_URL }}` ao serviço Node. |
| 5 | Redeploy o serviço Node. |
| 6 | Verifique logs do Node; procure por "✅ Database connected". |

---

## 🆘 Troubleshooting

### Erro: `ECONNREFUSED` ao rodar `npm run db:push`
- **Causa:** `DATABASE_URL` local está errada ou Postgres não acessível.
- **Solução:** Confirme a URL é a mesma do Railway; teste `psql` direto se necessário.

### Erro: `DATABASE_URL, ensure the database is provisioned` em `drizzle.config.ts`
- **Causa:** `DATABASE_URL` não foi setada no `.env`.
- **Solução:** Verifique que `.env` tem a linha `DATABASE_URL=...` (descomentada).

### No Railway, logs mostram `⚠️ DATABASE_URL não configurada`
- **Causa:** Variável de ambiente não foi setada no serviço Node da Railway.
- **Solução:** Vá em **Variables** do serviço Node, adicione `DATABASE_URL=${{ Postgres-YY2Z.DATABASE_URL }}` e redeploy.

### Aplicação roda mas dados não aparecem
- **Causa:** Schema foi criado mas tabelas vazias (é esperado em primeira vez).
- **Solução:** Próxima etapa é popular dados (seed), ou usar a app normalmente para criar via UI.

---

## ✅ Verificação Final

Quando tudo estiver conectado:

```bash
# Local: testa se db:push funcionou
npm run db:push

# Output esperado:
# [✓] Pushed schema successfully

# Em produção no Railway: confira os logs
# [serviço Node] "✅ Database connected via Drizzle ORM"
```

---

**Data:** 3 de dezembro de 2025  
**Status:** Pronto para implementação – Siga os passos acima.
