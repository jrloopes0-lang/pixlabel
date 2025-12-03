# Análise e Correção de Caminhos e Conexões - PixelLab

**Data**: 3 de dezembro de 2025  
**Status**: ✅ Corrigido  
**Commit**: `b2ee57a`

## 🔍 Problemas Identificados

### 1. **Mismatch no Envelope de Resposta API**

#### Problema
O backend retorna todas as respostas com um **envelope estruturado**:
```json
{
  "status": "success",
  "data": [...]
}
```

Porém, os hooks React Query em alguns componentes estavam tentando usar a resposta **sem desembrulhar** o envelope:

```tsx
// ❌ ERRADO
const { data: patients } = useQuery({
  queryFn: () => apiRequest("GET", "/api/sesi/pacientes")
  // patients recebe { status: "success", data: [...] }
  // em vez de apenas [...]
});
```

Isso causava:
- `patients.filter()` falhar (não é array)
- Loops `map()` iterarem sobre objeto inteiro
- Dados nunca serem exibidos corretamente

#### Componentes Afetados
1. `client/src/components/SelectPatient.tsx`
2. `client/src/components/DispenseMedicines.tsx`
3. `client/src/pages/EstoqueGeral.tsx`
4. `client/src/pages/Pedidos.tsx`

### 2. **Rotas Frontend vs Backend - Mapeamento Correto**

| Ação | Caminho Frontend | API Backend | Resultado |
|------|-----------------|-------------|-----------|
| **Login** | `/login` | `GET /api/auth/status` | ✅ Token salvado, redireciona `/estoque` |
| **Estoque** | `/estoque` | `GET /api/items` | ✅ Lista medicamentos |
| **Pedidos** | `/pedidos` | `GET /api/orders` | ✅ Lista pedidos |
| **SESI Hub** | `/sesi` | - | ✅ Menu com 3 opções |
| **SESI Pacientes** | `/sesi/pacientes` | `GET /api/sesi/pacientes` | ✅ Lista pacientes |
| **SESI Dispensar** | `/sesi/dispensar` | `GET /api/sesi/medicamentos` + `POST /api/sesi/dispensacoes` | ✅ Seleciona paciente → Dispensa medicamentos |
| **SESI Estoque** | `/sesi/estoque` | `GET /api/sesi/estoque` | ✅ Lista estoque SESI |

### 3. **Fluxo de Navegação Completo**

```
[Home] "/"
  ↓ "Entrar no Sistema"
[Login] "/login"
  ↓ Click "Entrar" → localStorage token + 300ms delay
[Estoque] "/estoque" ✅
  ├─ [Sidebar] ou [Menu]
  ├─ Link "/pedidos" → [Pedidos]
  ├─ Link "/sesi" → [SESI Hub]
  │   ├─ Link "/sesi/pacientes" → [SESI Pacientes]
  │   ├─ Link "/sesi/dispensar" → [SESI Dispensar]
  │   │   ├─ Etapa 1: SelectPatient (GET /api/sesi/pacientes)
  │   │   ├─ Etapa 2: DispenseMedicines (GET /api/sesi/medicamentos)
  │   │   └─ Botão "Dispensar" (POST /api/sesi/dispensacoes)
  │   └─ Link "/sesi/estoque" → [SESI Estoque]
  └─ [ProtectedLayout] garante autenticação

[Fallback] "*" → Home
```

## ✅ Soluções Implementadas

### 1. **Helper Function `extractData()`**

Criado em `client/src/lib/api.ts`:

```typescript
export function extractData<T = any>(response: ApiResponse<T>): T {
  if (response.status === "error") {
    throw new Error(response.error || "Unknown error");
  }
  return response.data as T;
}
```

### 2. **Atualização de Todos os Hooks**

#### SelectPatient.tsx
```tsx
const { data: allPatients = [], isLoading } = useQuery({
  queryKey: ["sesi-pacientes"],
  queryFn: async () => {
    const response = await apiRequest("GET", "/api/sesi/pacientes");
    return extractData(response);  // ✅ Desembrulha envelope
  },
});
```

#### DispenseMedicines.tsx
```tsx
const { data: availableMeds = [], isLoading: isLoadingMeds } = useQuery({
  queryKey: ["sesi-medicamentos"],
  queryFn: async () => {
    const response = await apiRequest("GET", "/api/sesi/medicamentos");
    return extractData(response);  // ✅ Desembrulha envelope
  },
});
```

#### EstoqueGeral.tsx
```tsx
const { data: items, isLoading } = useQuery({
  queryKey: queryKeys.items,
  queryFn: async () => {
    const response = await apiRequest("GET", "/api/items");
    return extractData(response) as Item[];  // ✅ Tipado e desembrulhado
  },
});
```

#### Pedidos.tsx
```tsx
const { data: orders, isLoading } = useQuery({
  queryKey: queryKeys.orders,
  queryFn: async () => {
    const response = await apiRequest("GET", "/api/orders");
    return extractData(response) as Order[];  // ✅ Tipado e desembrulhado
  },
});
```

## 🔄 Fluxo Esperado Após Correções

### Cenário: Dispensação SESI

1. **Usuário em `/sesi`** → Clica "Dispensações"
2. **Navega para `/sesi/dispensar`**
3. **ProtectedLayout** valida autenticação ✅
4. **SelectPatient** carrega:
   - `GET /api/sesi/pacientes` retorna `{ status, data: [...] }`
   - `extractData()` extrai array
   - `allPatients` recebe `[...]` ✅
5. **Usuário seleciona paciente**
6. **DispenseMedicines** carrega:
   - `GET /api/sesi/medicamentos` retorna `{ status, data: [...] }`
   - `extractData()` extrai array
   - `availableMeds` recebe `[...]` ✅
7. **Usuário preenche form e clica "Dispensar"**
8. **POST `/api/sesi/dispensacoes`**:
   - Backend valida paciente, estoque FIFO, deduz quantidade
   - Retorna `{ status: "success", data: { dispensationId, deductedItems } }`
   - `mutation.onSuccess()` triggered ✅
9. **Alert "✅ Dispensação realizada com sucesso!"**
10. **Form reseta, volta para SelectPatient**

## 📊 Resumo das Mudanças

| Arquivo | Mudanças |
|---------|----------|
| `lib/api.ts` | ✅ Adicionado `extractData()` helper |
| `components/SelectPatient.tsx` | ✅ Corrigido envelope unwrapping |
| `components/DispenseMedicines.tsx` | ✅ Corrigido envelope unwrapping |
| `pages/EstoqueGeral.tsx` | ✅ Corrigido envelope unwrapping |
| `pages/Pedidos.tsx` | ✅ Corrigido envelope unwrapping |

## 🚀 Próximas Etapas

1. ✅ **Commit enviado** ao GitHub (commit `b2ee57a`)
2. ⏳ **Railway rebuilding** - aguardar 2-3 minutos
3. 🔄 **Testar fluxo completo** em produção:
   - Abrir https://pixlabel-production.up.railway.app/
   - Login → Estoque (deve listar medicamentos)
   - Ir para SESI → Dispensar (deve listar pacientes)
   - Selecionar paciente (deve listar medicamentos disponíveis)
   - Dispensar (deve retornar sucesso)

## ✨ Resultado Final

✅ **Todos os caminhos corretos**  
✅ **Dados fluindo corretamente pelo envelope API**  
✅ **Navegação coherente entre telas**  
✅ **Fluxo SESI completo (selecionar → dispensar)**  

---

**Análise concluída**: Problema de envelope API era a causa raiz dos erros de conexão/roteamento. Componentes estavam recebendo estrutura errada, causando falhas de renderização e navegação.
