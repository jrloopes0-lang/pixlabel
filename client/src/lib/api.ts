// HTTP client wrapper com TanStack Query integration
type HTTPMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface FetchOptions {
  method?: HTTPMethod;
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

function getDemoToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("x-demo-token");
}

export async function apiRequest(
  method: HTTPMethod,
  endpoint: string,
  body?: Record<string, any>,
  headers?: Record<string, string>
) {
  const url = `${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  
  const demoToken = getDemoToken();
  const allHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };
  
  if (demoToken) {
    allHeaders["x-demo-token"] = demoToken;
  }
  
  const options: RequestInit = {
    method,
    credentials: "include", // Include cookies for session
    headers: allHeaders,
  };

  if (body && (method === "POST" || method === "PATCH" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  // Handle error responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Helper: Extract data from API response envelope
export function extractData<T = any>(response: ApiResponse<T>): T {
  if (response.status === "error") {
    throw new Error(response.error || "Unknown error");
  }
  return response.data as T;
}

// Query helpers
export const queryKeys = {
  auth: ["auth"],
  items: ["items"],
  orders: ["orders"],
  units: ["units"],
  suppliers: ["suppliers"],
  sesiPatients: ["sesi", "patients"],
  sesiStock: ["sesi", "stock"],
  sesiDispensations: ["sesi", "dispensations"],
} as const;

// Response types
export interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  status: "success" | "error";
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}
