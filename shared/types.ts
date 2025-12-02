
// Tipos exportados do schema
export * from "./schema";

// Envelope de resposta
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: "success" | "error";
}

// Paginação
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth
export interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "admin" | "operator";
  };
}

// Order creation
export interface CreateOrderPayload {
  supplierId: string;
  items: Array<{
    itemId: string;
    quantity: number;
  }>;
  horizonMonths?: number;
}

// SESI Dispensation
export interface SesiDispensationPayload {
  patientId: string;
  medicamentos: Array<{
    medicationId: string;
    quantity: number;
    batchNumber?: string;
    expiryDate?: string;
  }>;
}

// SESI Dispensation Response
export interface SesiDispensationResponse {
  success: boolean;
  dispensationId?: string;
  deductedItems: Array<{
    medicationId: string;
    quantityDeducted: number;
    batchNumber?: string;
  }>;
  message?: string;
}

// Filtros
export interface ItemFilters {
  search?: string;
  sortBy?: "name" | "code" | "stock";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface OrderFilters {
  supplierId?: string;
  status?: string[];
  createdAfter?: string;
  createdBefore?: string;
  limit?: number;
  offset?: number;
}
