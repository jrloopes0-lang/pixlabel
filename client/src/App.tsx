import { Router, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useIsAuthenticated } from "@/hooks/use-auth";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { EstoqueGeral } from "@/pages/EstoqueGeral";
import { Pedidos } from "@/pages/Pedidos";
import { SESI } from "@/pages/SESI";
import { SESIPacientes } from "@/pages/sesi/Pacientes";
import { SESIDispensar } from "@/pages/sesi/Dispensar";
import { SESIEstoque } from "@/pages/sesi/Estoque";

// Protected layout wrapper
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  console.log("[ProtectedLayout] State:", { isAuthenticated, isLoading });

  // Still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    console.log("[ProtectedLayout] Not authenticated, showing login");
    return <Login />;
  }

  // Authenticated - render protected content
  console.log("[ProtectedLayout] Authenticated, rendering children");
  return <>{children}</>;
}

export function App() {
  console.log("[App] Rendering - checking initial auth state");
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Redirect OAuth callback to login */}
        <Route path="/auth/login">
          {() => {
            console.log("[Route] /auth/login");
            return <Login />;
          }}
        </Route>

        {/* Public login route */}
        <Route path="/login">
          {() => {
            console.log("[Route] /login");
            return <Login />;
          }}
        </Route>

        {/* Home route */}
        <Route path="/">
          {() => {
            console.log("[Route] / (home)");
            return <Home />;
          }}
        </Route>

        {/* Protected routes */}
        <Route path="/estoque">
          {() => {
            console.log("[Route] /estoque (protected)");
            return (
              <ProtectedLayout>
                <EstoqueGeral />
              </ProtectedLayout>
            );
          }}
        </Route>

        <Route path="/pedidos">
          {() => {
            console.log("[Route] /pedidos (protected)");
            return (
              <ProtectedLayout>
                <Pedidos />
              </ProtectedLayout>
            );
          }}
        </Route>

        <Route path="/sesi">
          {() => {
            console.log("[Route] /sesi (protected)");
            return (
              <ProtectedLayout>
                <SESI />
              </ProtectedLayout>
            );
          }}
        </Route>

        <Route path="/sesi/pacientes">
          {() => {
            console.log("[Route] /sesi/pacientes (protected)");
            return (
              <ProtectedLayout>
                <SESIPacientes />
              </ProtectedLayout>
            );
          }}
        </Route>

        <Route path="/sesi/dispensar">
          {() => {
            console.log("[Route] /sesi/dispensar (protected)");
            return (
              <ProtectedLayout>
                <SESIDispensar />
              </ProtectedLayout>
            );
          }}
        </Route>

        <Route path="/sesi/estoque">
          {() => {
            console.log("[Route] /sesi/estoque (protected)");
            return (
              <ProtectedLayout>
                <SESIEstoque />
              </ProtectedLayout>
            );
          }}
        </Route>

        {/* Fallback for non-existent routes */}
        <Route path="*">
          {() => {
            console.log("[Route] * (fallback to home)");
            return <Home />;
          }}
        </Route>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
