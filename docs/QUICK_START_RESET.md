# ⚡ Quick Start: Reiniciar Sistema PIXLABEL

Guia rápido para reiniciar o sistema em diferentes cenários.

---

## 🚀 Primeiro Uso (Setup Inicial)

```bash
# 1. Configurar DATABASE_URL
export DATABASE_URL='postgresql://user:pass@host:5432/pixlabel'

# 2. Criar estrutura + dados iniciais
npm run db:reiniciar

# 3. Iniciar servidor
npm run dev
```

✅ **Pronto!** O sistema está rodando com dados de exemplo.

---

## 🔄 Reset Durante Desenvolvimento

### Cenário: "Preciso começar do zero"

```bash
npm run db:reiniciar
```

Isso vai:
- ✅ Limpar todas as tabelas
- ✅ Recriar estrutura do banco
- ✅ Popular com dados de exemplo

### Cenário: "Só quero limpar dados"

```bash
npm run db:reset
```

Isso vai:
- ✅ Limpar todas as tabelas
- ✅ Recriar estrutura do banco
- ❌ NÃO carrega dados (banco vazio)

### Cenário: "Só quero adicionar dados de teste"

```bash
npm run db:seed
```

Isso vai:
- ✅ Adicionar dados de exemplo
- ⚠️ Falha se dados já existem (use `db:reset` antes)

---

## 📊 O Que o Seed Cria?

Após `npm run db:seed`, você terá:

### 👤 Usuários
- **admin@pixlabel.local** (role: admin)
- **operador@pixlabel.local** (role: operator)

### 💊 8 Medicamentos
Paracetamol, Dipirona, Losartana, Metformina, Omeprazol, Amoxicilina, Atenolol, Sinvastatina

### 🏥 4 Unidades
UBS Centro, UBS Bairro Norte, Hospital Municipal, Farmácia Central

### 🏢 3 Fornecedores
Farmamed, Medicamentos Nordeste, Farma Ceará

### 👨‍⚕️ 3 Pacientes SESI
Maria da Silva, João Pereira, Ana Paula

### 📦 Estoque SESI
4 lotes com validades futuras

---

## 🛡️ Segurança em Produção

Em `NODE_ENV=production`, o script pede confirmação:

```bash
export NODE_ENV=production
npm run db:reset

# Output:
⚠️  ATENÇÃO: Você está em ambiente de PRODUÇÃO!
Tem certeza que deseja resetar o banco de dados? (y/n): 
```

Digite `n` para cancelar.

---

## 🔧 Troubleshooting Rápido

### Erro: "DATABASE_URL não configurada"
```bash
export DATABASE_URL='postgresql://user:pass@host:5432/db'
```

### Erro: "duplicate key value"
```bash
# Dados já existem, limpe primeiro:
npm run db:reset
npm run db:seed
```

### Erro: "connection refused"
```bash
# Verificar se PostgreSQL está rodando
pg_isready -h localhost -p 5432

# Testar conexão
psql $DATABASE_URL -c "SELECT version();"
```

### Script trava?
- Pressione `Ctrl+C`
- Verifique se há transações abertas no banco
- Execute novamente

---

## 📚 Documentação Completa

Para detalhes completos, veja: [RESET_SISTEMA.md](./RESET_SISTEMA.md)

---

## 🎯 Fluxo Recomendado

```
┌─────────────────────────────────────┐
│ Projeto Novo / Setup Inicial        │
│ → npm run db:reiniciar              │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ Desenvolvimento / Testes            │
│ → npm run db:reiniciar (quando      │
│   precisar de dados limpos)         │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ Demonstração / Apresentação         │
│ → npm run db:reiniciar              │
│ → npm run dev                       │
└─────────────────────────────────────┘
```

---

**PIXLABEL** - Sistema de Gestão Farmacêutica  
Última atualização: Dezembro 2025
