# 🎨 Visual Guide: Sistema de Reinicialização PIXLABEL

Guia visual rápido dos comandos de reset do sistema.

---

## 📊 Fluxograma de Comandos

```
┌─────────────────────────────────────────────────────┐
│                INÍCIO DO PROJETO                    │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  npm run db:reiniciar│ ← COMANDO PRINCIPAL
         └──────────┬───────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
  ┌─────────────┐      ┌─────────────┐
  │  db:reset   │      │  db:seed    │
  └─────────────┘      └─────────────┘
         │                     │
         ▼                     ▼
  DROP + CREATE           INSERT DATA
    11 tabelas            ~25 registros
```

---

## 🎯 Comandos Disponíveis

### 1️⃣ Reset Completo (Recomendado)

```bash
npm run db:reiniciar
```

**O que acontece:**
```
🔄 Passo 1: DROP todas tabelas
   ├─ sesi_dispensations ✓
   ├─ sesi_stock ✓
   ├─ sesi_patients ✓
   ├─ audit_logs ✓
   ├─ import_history ✓
   ├─ order_items ✓
   ├─ orders ✓
   ├─ items ✓
   ├─ suppliers ✓
   ├─ units ✓
   └─ users ✓

📦 Passo 2: CREATE todas tabelas + índices

🌱 Passo 3: INSERT dados iniciais
   ├─ 2 users ✓
   ├─ 4 units ✓
   ├─ 3 suppliers ✓
   ├─ 8 medications ✓
   ├─ 3 SESI patients ✓
   ├─ 4 SESI stock batches ✓
   └─ 1 sample order ✓

✅ Sistema pronto para uso!
```

---

### 2️⃣ Apenas Reset (Sem Dados)

```bash
npm run db:reset
```

**Resultado:**
```
База de dados limpa
├─ Tabelas: VAZIAS ✓
└─ Estrutura: PRONTA ✓

⚠️ Banco está vazio!
Execute 'npm run db:seed' para adicionar dados
```

---

### 3️⃣ Apenas Seed (Adicionar Dados)

```bash
npm run db:seed
```

**Resultado:**
```
Dados adicionados
├─ Users: 2 ✓
├─ Units: 4 ✓
├─ Suppliers: 3 ✓
├─ Medications: 8 ✓
├─ SESI Patients: 3 ✓
└─ SESI Stock: 4 batches ✓

⚠️ Se dados já existem → ERRO
Solução: Execute 'npm run db:reset' primeiro
```

---

## 🗂️ Estrutura de Dados Criada

### 👤 Usuários (2)

```
┌──────────────────────────┬───────────┐
│ Email                    │ Role      │
├──────────────────────────┼───────────┤
│ admin@pixlabel.local     │ admin     │
│ operador@pixlabel.local  │ operator  │
└──────────────────────────┴───────────┘
```

### 🏥 Unidades de Saúde (4)

```
┌─────────────────────┬──────────────┐
│ Nome                │ Tipo         │
├─────────────────────┼──────────────┤
│ UBS Centro          │ centro_saude │
│ UBS Bairro Norte    │ centro_saude │
│ Hospital Municipal  │ hospital     │
│ Farmácia Central    │ farmacia     │
└─────────────────────┴──────────────┘
```

### 💊 Medicamentos (8)

```
┌──────────┬─────────────────────┬─────────────────────────┐
│ Código   │ Nome                │ Apresentação            │
├──────────┼─────────────────────┼─────────────────────────┤
│ MED001   │ Paracetamol         │ 500mg - Comprimido      │
│ MED002   │ Dipirona            │ 500mg - Comprimido      │
│ MED003   │ Losartana Potássica │ 50mg - Comprimido       │
│ MED004   │ Metformina          │ 850mg - Comprimido      │
│ MED005   │ Omeprazol           │ 20mg - Cápsula          │
│ MED006   │ Amoxicilina         │ 500mg - Cápsula         │
│ MED007   │ Atenolol            │ 25mg - Comprimido       │
│ MED008   │ Sinvastatina        │ 20mg - Comprimido       │
└──────────┴─────────────────────┴─────────────────────────┘
```

### 👨‍⚕️ Pacientes SESI (3)

```
┌───────────────────────┬──────────────┬────────────┐
│ Nome                  │ CPF          │ Condição   │
├───────────────────────┼──────────────┼────────────┤
│ Maria da Silva Santos │ 12345678901  │ HT + DM2   │
│ João Pereira Costa    │ 23456789012  │ DM1        │
│ Ana Paula Oliveira    │ 34567890123  │ HT         │
└───────────────────────┴──────────────┴────────────┘
```

### 📦 Estoque SESI (4 lotes)

```
┌────────────────────┬─────────────────┬──────────────┬────────────┐
│ Medicamento        │ Lote            │ Validade     │ Quantidade │
├────────────────────┼─────────────────┼──────────────┼────────────┤
│ Losartana          │ LOTE-2024-001   │ 2026-12-31   │ 200        │
│ Losartana          │ LOTE-2024-002   │ 2027-06-30   │ 150        │
│ Metformina         │ LOTE-2024-003   │ 2026-09-30   │ 300        │
│ Atenolol           │ LOTE-2024-004   │ 2026-11-30   │ 180        │
└────────────────────┴─────────────────┴──────────────┴────────────┘
```

---

## 🎬 Demonstração de Uso

### Cenário 1: Primeiro Setup

```bash
# Terminal
$ cd pixlabel
$ npm install
$ npm run db:reiniciar

🔄 PIXLABEL - System Reset
===========================

🗑️  Dropping all tables...
  ✓ Table sesi_dispensations dropped
  ✓ Table sesi_stock dropped
  [...]

📦 Creating tables...
  ✓ Table users created
  ✓ Table units created
  [...]

✅ All tables created successfully!

🌱 PIXLABEL - Loading Initial Data
=========================================

👤 Creating users...
  ✓ Admin created: admin@pixlabel.local
  ✓ Operator created: operador@pixlabel.local

[...]

✅ Initial data loaded successfully!

📊 Summary:
   • 2 users
   • 4 health units
   • 3 suppliers
   • 8 medications
   • 3 SESI patients
   • 4 SESI stock batches
   • 1 sample order

💡 Access credentials:
   Admin:    admin@pixlabel.local
   Operator: operador@pixlabel.local

# Pronto! Sistema está online
$ npm run dev
```

---

## 🔒 Proteção em Produção

### NODE_ENV=production

```bash
$ export NODE_ENV=production
$ npm run db:reset

🔄 PIXLABEL - System Reset
===========================

⚠️  WARNING: You are in PRODUCTION environment!
Are you sure you want to reset the database? (y/n): █

# Opções:
# - Digite 'n' → Cancela
# - Digite 'y' → Continua (COM CUIDADO!)
```

---

## 📁 Estrutura de Arquivos

```
pixlabel/
├── scripts/
│   ├── reset-db.ts          ← Script principal de reset
│   ├── seed-db.ts           ← Script de seed
│   └── test-scripts.sh      ← Validação
├── docs/
│   ├── RESET_SISTEMA.md     ← Guia completo
│   ├── QUICK_START_RESET.md ← Quick start
│   └── RESET_VISUAL_GUIDE.md ← Este arquivo
├── package.json             ← Comandos npm
└── README.md                ← Overview
```

---

## ⚡ Atalhos de Teclado (Bash)

```bash
# Aliases úteis (adicione em ~/.bashrc ou ~/.zshrc)
alias px-reset='npm run db:reiniciar'
alias px-clean='npm run db:reset'
alias px-seed='npm run db:seed'
alias px-dev='npm run dev'

# Uso:
$ px-reset   # Reset completo
$ px-dev     # Iniciar servidor
```

---

## 🎯 Checklist Rápido

Antes de executar reset:

- [ ] Fiz backup dos dados importantes? (produção)
- [ ] Tenho DATABASE_URL configurada?
- [ ] Estou no ambiente certo? (dev vs prod)
- [ ] Sei que perderrei TODOS os dados?

Após executar reset:

- [ ] Tabelas foram criadas?
- [ ] Dados foram inseridos?
- [ ] Servidor inicia sem erros?
- [ ] Posso fazer login com credenciais seed?

---

## 🆘 Troubleshooting Visual

```
PROBLEMA                           SOLUÇÃO
────────────────────────────────   ───────────────────────────
❌ DATABASE_URL not configured     → cp .env.example .env
                                     → editar DATABASE_URL

❌ Connection refused              → Verificar PostgreSQL rodando
                                     → pg_isready -h localhost

❌ duplicate key value             → npm run db:reset (limpar antes)

❌ Permission denied               → Verificar permissões do usuário
                                     → GRANT ALL ON DATABASE

❌ Script trava                    → Ctrl+C
                                     → Verificar transações abertas
                                     → Executar novamente
```

---

## 📞 Ajuda Adicional

- **Documentação completa**: `docs/RESET_SISTEMA.md`
- **Quick start**: `docs/QUICK_START_RESET.md`
- **README**: Seção "Reiniciar o Sistema"

---

**PIXLABEL** - Sistema de Gestão Farmacêutica  
Última atualização: Dezembro 2025
