# 🔄 Reiniciar o Sistema PIXLABEL

Este documento descreve como reiniciar/resetar o sistema PIXLABEL para desenvolvimento e testes.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Comandos Disponíveis](#comandos-disponíveis)
3. [Pré-requisitos](#pré-requisitos)
4. [Guia de Uso](#guia-de-uso)
5. [Dados Iniciais (Seed)](#dados-iniciais-seed)
6. [Avisos de Segurança](#avisos-de-segurança)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema PIXLABEL oferece scripts para reiniciar o banco de dados, permitindo:

- **Reset completo**: Limpar todas as tabelas e recriar a estrutura
- **Seed de dados**: Popular o banco com dados iniciais para desenvolvimento
- **Reinício total**: Reset + Seed em um único comando

### Quando Usar?

- **Desenvolvimento**: Testar funcionalidades com dados limpos
- **Testes**: Criar ambiente de teste controlado
- **Demo**: Preparar demonstração com dados de exemplo
- **Correção**: Resolver problemas de estrutura do banco

---

## 🛠️ Comandos Disponíveis

### 1. Reset do Banco de Dados

```bash
npm run db:reset
```

**O que faz:**
- Remove todas as tabelas existentes (DROP CASCADE)
- Recria todas as 11 tabelas do schema
- Recria índices e constraints
- **ATENÇÃO**: Todos os dados serão perdidos!

**Output esperado:**
```
🔄 PIXLABEL - Reset do Sistema
================================

🗑️  Removendo todas as tabelas...
  ✓ Tabela sesi_dispensations removida
  ✓ Tabela sesi_stock removida
  ...

📦 Criando tabelas...
  ✓ Tabela users criada
  ✓ Tabela units criada
  ...

✅ Todas as tabelas foram criadas com sucesso!
```

### 2. Seed de Dados Iniciais

```bash
npm run db:seed
```

**O que faz:**
- Insere dados de exemplo no banco
- Cria usuários (admin e operador)
- Cria unidades de saúde
- Cria fornecedores
- Cria medicamentos de exemplo
- Cria pacientes SESI
- Cria estoque SESI inicial
- Cria um pedido de exemplo

**Output esperado:**
```
🌱 PIXLABEL - Carregando Dados Iniciais
=========================================

👤 Criando usuários...
  ✓ Admin criado: admin@pixlabel.local
  ✓ Operador criado: operador@pixlabel.local

📊 Resumo:
   • 2 usuários
   • 4 unidades de saúde
   • 3 fornecedores
   • 8 medicamentos
   • 3 pacientes SESI
   • 4 lotes de estoque SESI
```

### 3. Reinício Completo

```bash
npm run db:reiniciar
```

**O que faz:**
- Executa `db:reset` (limpa e recria)
- Executa `db:seed` (popula dados)
- Deixa o sistema pronto para uso imediato

**Equivalente a:**
```bash
npm run db:reset && npm run db:seed
```

---

## ✅ Pré-requisitos

### 1. Variável de Ambiente

Certifique-se de que `DATABASE_URL` está configurada:

```bash
# Verificar se está configurada
echo $DATABASE_URL

# Se vazio, configure no .env
# Exemplo:
DATABASE_URL=postgresql://user:pass@host:5432/pixlabel_dev
```

### 2. Banco de Dados Acessível

O banco PostgreSQL deve estar:
- ✅ Online e acessível
- ✅ Com permissões de CREATE/DROP
- ✅ Vazio ou pronto para reset

### 3. Dependências Instaladas

```bash
npm install
```

---

## 📖 Guia de Uso

### Cenário 1: Primeiro Setup (Projeto Novo)

```bash
# 1. Clonar repositório
git clone https://github.com/jrloopes0-lang/pixlabel.git
cd pixlabel

# 2. Instalar dependências
npm install

# 3. Configurar .env
cp .env.example .env
# Editar DATABASE_URL no .env

# 4. Reiniciar sistema (criar estrutura + dados)
npm run db:reiniciar

# 5. Iniciar servidor
npm run dev
```

### Cenário 2: Reset Durante Desenvolvimento

```bash
# Limpar tudo e recomeçar com dados novos
npm run db:reiniciar

# OU fazer em etapas:
npm run db:reset    # Só limpar
npm run db:seed     # Só adicionar dados
```

### Cenário 3: Só Adicionar Dados (Sem Limpar)

```bash
# Se o banco já está criado, mas vazio
npm run db:seed
```

⚠️ **Nota**: Se houver dados duplicados (emails, CPFs únicos), o seed falhará. Neste caso, execute `db:reset` primeiro.

### Cenário 4: Ambiente de Produção

```bash
# ATENÇÃO: Confirma antes de executar!
NODE_ENV=production npm run db:reset

# O script pedirá confirmação:
# ⚠️  ATENÇÃO: Você está em ambiente de PRODUÇÃO!
# Tem certeza que deseja resetar o banco de dados? (y/n): 
```

---

## 📊 Dados Iniciais (Seed)

Após executar `npm run db:seed`, o banco terá:

### 👤 Usuários

| Email | Nome | Role |
|-------|------|------|
| admin@pixlabel.local | Administrador Sistema | admin |
| operador@pixlabel.local | Operador Farmácia | operator |

### 🏥 Unidades de Saúde

- UBS Centro
- UBS Bairro Norte
- Hospital Municipal
- Farmácia Central

### 🏢 Fornecedores

- Farmamed Distribuidora (prioridade alta)
- Medicamentos Nordeste LTDA (prioridade média)
- Farma Ceará (prioridade média)

### 💊 Medicamentos (8 itens)

- Paracetamol 500mg
- Dipirona 500mg
- Losartana Potássica 50mg
- Metformina 850mg
- Omeprazol 20mg
- Amoxicilina 500mg
- Atenolol 25mg
- Sinvastatina 20mg

### 👨‍⚕️ Pacientes SESI (3 pacientes)

- Maria da Silva Santos (hipertensão + diabetes)
- João Pereira Costa (diabetes tipo 1)
- Ana Paula Oliveira (hipertensão)

### 📦 Estoque SESI (4 lotes)

- Losartana: 2 lotes (350 unidades total)
- Metformina: 1 lote (300 unidades)
- Atenolol: 1 lote (180 unidades)

---

## 🔐 Avisos de Segurança

### ⚠️ NUNCA Execute em Produção Sem Backup!

```bash
# ERRADO - Pode destruir dados reais!
NODE_ENV=production npm run db:reset

# CERTO - Faça backup primeiro!
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
NODE_ENV=production npm run db:reset
```

### ⚠️ Confirmação Obrigatória em Produção

O script `db:reset` detecta `NODE_ENV=production` e pede confirmação:

```
⚠️  ATENÇÃO: Você está em ambiente de PRODUÇÃO!
Tem certeza que deseja resetar o banco de dados? (y/n): 
```

Digite `n` para cancelar. O script não executará sem confirmação explícita.

### ⚠️ DATABASE_URL Obrigatória

Os scripts não funcionam sem `DATABASE_URL`:

```bash
# Erro se DATABASE_URL não existe:
❌ Erro: DATABASE_URL não configurada
Configure DATABASE_URL no arquivo .env
```

---

## 🔧 Troubleshooting

### Problema: "DATABASE_URL não configurada"

**Solução:**
```bash
# Criar/editar .env
echo 'DATABASE_URL=postgresql://user:pass@host:5432/db' > .env

# OU exportar temporariamente
export DATABASE_URL=postgresql://user:pass@host:5432/db
npm run db:reset
```

### Problema: "Cannot find module '../shared/schema.js'"

**Solução:**
```bash
# Instalar dependências
npm install

# Verificar TypeScript
npm run check
```

### Problema: "permission denied" ou "role does not exist"

**Solução:**
```bash
# Verificar permissões do usuário PostgreSQL
# O usuário precisa de CREATE/DROP privileges

# Testar conexão:
psql $DATABASE_URL -c "SELECT version();"
```

### Problema: Seed falha com "duplicate key value"

**Causa:** Dados já existem no banco (emails/CPFs únicos duplicados)

**Solução:**
```bash
# Executar reset antes do seed
npm run db:reset
npm run db:seed

# OU usar o comando combinado
npm run db:reiniciar
```

### Problema: "Connection refused" ou "timeout"

**Solução:**
```bash
# 1. Verificar se PostgreSQL está rodando
pg_isready -h localhost -p 5432

# 2. Verificar DATABASE_URL
echo $DATABASE_URL

# 3. Testar conexão direta
psql $DATABASE_URL

# 4. Verificar firewall/rede (se Neon/Railway)
curl -v https://console.neon.tech
```

### Problema: Script trava ou não responde

**Solução:**
```bash
# 1. Cancelar com Ctrl+C

# 2. Verificar se há transações abertas no DB
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# 3. Matar processos se necessário
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active';"

# 4. Executar novamente
npm run db:reset
```

---

## 📚 Comandos Relacionados

| Comando | Descrição |
|---------|-----------|
| `npm run db:push` | Sincroniza schema Drizzle → PostgreSQL (sem destruir dados) |
| `npm run db:reset` | Reset completo (DROP + CREATE) |
| `npm run db:seed` | Popular dados iniciais |
| `npm run db:reiniciar` | Reset + Seed (combo) |
| `npm run dev` | Iniciar servidor dev |
| `npm run check` | TypeScript check |

---

## 🔗 Arquivos Relacionados

- **Scripts**: `/scripts/reset-db.ts`, `/scripts/seed-db.ts`
- **Schema**: `/shared/schema.ts`
- **Package**: `/package.json` (definições dos comandos)
- **Config**: `/.env` (DATABASE_URL)

---

## 📝 Notas Finais

- ✅ Scripts seguros: confirmação em produção
- ✅ Dados de exemplo realistas
- ✅ Compatível com PostgreSQL 12+
- ✅ Funciona com Neon, Railway, local
- ✅ Índices e constraints preservados

**Desenvolvido para PIXLABEL - Sistema de Gestão Farmacêutica**

**Última atualização**: 2 de dezembro de 2025
