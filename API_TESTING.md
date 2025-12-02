# 🧪 API Testing Guide – PIXLABEL FASE 2

## Quick Start

```bash
# 1. Iniciar dev server em um terminal
export DATABASE_URL="postgresql://test:test@localhost:5432/pixlabel_dev"
export SESSION_SECRET="dev-secret"
npm run dev

# 2. Em outro terminal, testar endpoints
```

---

## 📌 Health Check

```bash
curl http://localhost:3000/api/health
# Response: { "status": "ok" }
```

---

## 💊 Items (Medicamentos)

### 1. List all items
```bash
curl http://localhost:3000/api/items
```

### 2. Create item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "code": "MED-001",
    "name": "Dipirona",
    "presentation": "500mg",
    "currentStock": 100,
    "monthlyConsumption": 50,
    "minStockMonths": 3
  }'
```

### 3. Update item
```bash
curl -X PATCH http://localhost:3000/api/items/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "currentStock": 150
  }'
```

### 4. Delete item
```bash
curl -X DELETE http://localhost:3000/api/items/{id}
```

---

## 📦 Orders (Pedidos)

### 1. List orders
```bash
curl http://localhost:3000/api/orders
```

### 2. Create order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": "supplier-uuid",
    "horizonMonths": 6,
    "items": [
      { "itemId": "item-uuid", "quantity": 50 }
    ]
  }'
```

### 3. Update order status
```bash
curl -X PATCH http://localhost:3000/api/orders/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sent"
  }'
```

---

## 👥 Units (Unidades de Saúde)

### 1. List units
```bash
curl http://localhost:3000/api/units
```

### 2. Create unit
```bash
curl -X POST http://localhost:3000/api/units \
  -H "Content-Type: application/json" \
  -d '{
    "name": "UBS Centro",
    "type": "basic_health_unit"
  }'
```

---

## 🏭 Suppliers (Fornecedores)

### 1. List suppliers
```bash
curl http://localhost:3000/api/suppliers
```

### 2. Create supplier
```bash
curl -X POST http://localhost:3000/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Distribuidor XYZ",
    "contact": "+55 11 1234-5678",
    "priority": 1
  }'
```

---

## 🩺 SESI – Pacientes (Patients with Special Needs)

### 1. List patients
```bash
curl http://localhost:3000/api/sesi/pacientes
```

### 2. Search patients
```bash
curl "http://localhost:3000/api/sesi/pacientes?search=João"
```

### 3. Create patient
```bash
curl -X POST http://localhost:3000/api/sesi/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "cpf": "12345678901",
    "dateOfBirth": "1990-01-15",
    "phone": "(11) 98765-4321",
    "address": "Rua A, 123",
    "active": true
  }'
```

### 4. Update patient
```bash
curl -X PATCH http://localhost:3000/api/sesi/pacientes/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "(11) 99999-9999"
  }'
```

---

## 📦 SESI – Estoque (Stock)

### 1. List SESI stock
```bash
curl http://localhost:3000/api/sesi/estoque
```

### 2. Create stock entry
```bash
curl -X POST http://localhost:3000/api/sesi/estoque \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "item-uuid",
    "batchNumber": "LOTE-2025-001",
    "expiryDate": "2025-12-31",
    "quantity": 50
  }'
```

---

## 🔍 SESI – Buscar Medicamentos

```bash
curl "http://localhost:3000/api/sesi/medicamentos?q=dipirona"

# Response:
[
  {
    "id": "med-uuid",
    "name": "Dipirona",
    "code": "MED-001",
    "sesiQuantity": 25
  }
]
```

---

## 💉 SESI – Dispensações (⭐ CRITICAL FLOW)

### Dispensar medicamentos para paciente

```bash
curl -X POST http://localhost:3000/api/sesi/dispensacoes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "medicamentos": [
      {
        "medicationId": "med-uuid",
        "quantity": 10,
        "batchNumber": "LOTE-2025-001"
      },
      {
        "medicationId": "med-uuid-2",
        "quantity": 5,
        "batchNumber": "LOTE-2025-002"
      }
    ]
  }'

# Success (201):
{
  "status": "success",
  "data": {
    "success": true,
    "dispensationId": "disp-uuid",
    "deductedItems": [
      {
        "medicationId": "med-uuid",
        "quantityDeducted": 10,
        "batchNumber": "LOTE-2025-001"
      }
    ],
    "message": "Dispensation completed successfully"
  }
}

# Error – Patient not found (404):
{
  "status": "error",
  "error": "Patient not found"
}

# Error – Insufficient stock (400):
{
  "status": "error",
  "error": "Insufficient stock for medication..."
}
```

**⭐ Lógica FIFO:** Estoque é deduzido por data de validade (mais antigo primeiro) – compliance FDA CFR 21 Part 11.

---

## 🔐 Auth Endpoints

### 1. Check auth status
```bash
curl http://localhost:3000/api/auth/status

# Response (logged in):
{
  "data": {
    "isAuthenticated": true,
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "João",
      "lastName": "Silva",
      "role": "admin"
    }
  }
}

# Response (not logged in):
{
  "data": {
    "isAuthenticated": false,
    "user": null
  }
}
```

### 2. Logout
```bash
curl http://localhost:3000/api/auth/logout
# Response: { "status": "success", "message": "Logged out" }
```

---

## 📊 Response Format

All API responses follow this envelope:

### Success (200/201)
```json
{
  "status": "success",
  "data": { /* ... */ }
}
```

### Error (400/404/500)
```json
{
  "status": "error",
  "error": "Human-readable error message"
}
```

---

## 🧪 Testing with Postman/Insomnia

1. Import this collection or use curl commands above
2. Set base URL: `http://localhost:3000/api`
3. Add Content-Type header: `application/json`
4. Test each endpoint sequentially
5. For SESI dispensação: First create patient + stock entries

---

## ⚡ Performance Tips

- **Search queries:** Use `?q=term` with 3+ characters
- **List pagination:** TODO (implement offset/limit)
- **Batch imports:** Use `/api/sesi/estoque` with array of items

---

## 🔧 Debugging

If you get connection errors:

1. Check DATABASE_URL is set:
   ```bash
   echo $DATABASE_URL
   ```

2. Check dev server is running:
   ```bash
   curl http://localhost:3000/api/health
   ```

3. Check TypeScript errors:
   ```bash
   npm run check
   ```

4. View server logs (terminal where `npm run dev` runs)

---

_Updated: Dec 1, 2025 | PIXLABEL FASE 2_
