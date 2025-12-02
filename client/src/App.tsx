import { Router, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useIsAuthenticated } from "@/hooks/use-auth";
import Home from "@/pages/Home";
import { EstoqueGeral } from "@/pages/EstoqueGeral";
import { Pedidos } from "@/pages/Pedidos";
import { SESI } from "@/pages/SESI";
import { SESIPacientes } from "@/pages/sesi/Pacientes";
import { SESIDispensar } from "@/pages/sesi/Dispensar";
import { SESIEstoque } from "@/pages/sesi/Estoque";

// Login page
function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">PIXLABEL</h1>
        <p className="text-lg text-gray-600 mb-8">Sistema de Gestão Farmacêutica</p>
        <a
          href="/auth/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Entrar
        </a>
        <p className="text-xs text-gray-500 mt-4">Redirecionando para autenticação...</p>
      </div>
    </div>
  );
}

// Layout wrapper para rotas autenticadas
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Public routes */}
        <Route path="/login" component={Login} />

        {/* Authenticated routes */}
        <Route path="/">
          {() => (
            <AuthenticatedLayout>
              <Home />
            </AuthenticatedLayout>
          )}
        </Route>

        <Route path="/estoque">
          {() => (
            <AuthenticatedLayout>
              <EstoqueGeral />
            </AuthenticatedLayout>
          )}
        </Route>

        <Route path="/pedidos">
          {() => (
            <AuthenticatedLayout>
              <Pedidos />
            </AuthenticatedLayout>
          )}
        </Route>

        <Route path="/sesi">
          {() => (
            <AuthenticatedLayout>
              <SESI />
            </AuthenticatedLayout>
          )}
        </Route>

        <Route path="/sesi/pacientes">
          {() => (
            <AuthenticatedLayout>
              <SESIPacientes />
            </AuthenticatedLayout>
          )}
        </Route>

        <Route path="/sesi/dispensar">
          {() => (
            <AuthenticatedLayout>
              <SESIDispensar />
            </AuthenticatedLayout>
          )}
        </Route>

        <Route path="/sesi/estoque">
          {() => (
            <AuthenticatedLayout>
              <SESIEstoque />
            </AuthenticatedLayout>
          )}
        </Route>

        {/* 404 */}
        <Route>
          {() => (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Página não encontrada</p>
                <a href="/" className="text-blue-600 hover:underline">
                  Voltar ao início
                </a>
              </div>
            </div>
          )}
        </Route>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
