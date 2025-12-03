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

// Layout wrapper para rotas autenticadas
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;  }

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

        {/* Home route - Public */}
        <Route path="/">
          <Home />
        </Route>

        {/* Protected routes with layout */}
        <Route path="/estoque">
          <AuthenticatedLayout>
            <EstoqueGeral />
          </AuthenticatedLayout>
        </Route>

        <Route path="/pedidos">
          <AuthenticatedLayout>
            <Pedidos />
          </AuthenticatedLayout>
        </Route>

        <Route path="/sesi">
          <AuthenticatedLayout>
            <SESI />
          </AuthenticatedLayout>
        </Route>

        <Route path="/sesi/pacientes">
          <AuthenticatedLayout>
            <SESIPacientes />
          </AuthenticatedLayout>
        </Route>

        <Route path="/sesi/dispensar">
          <AuthenticatedLayout>
            <SESIDispensar />
          </AuthenticatedLayout>
        </Route>

        <Route path="/sesi/estoque">
          <AuthenticatedLayout>
            <SESIEstoque />
          </AuthenticatedLayout>
        </Route>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
