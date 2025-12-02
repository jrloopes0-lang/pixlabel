import { useIsAuthenticated } from "@/hooks/use-auth";
import { Link } from "wouter";

export function AppHeader() {
  const { isAuthenticated, user } = useIsAuthenticated();

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-full px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-blue-600">PIXLABEL</h1>
          <span className="text-xs text-gray-500">v1.0</span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <a
                href="/auth/logout"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Sair
              </a>
            </div>
          ) : (
            <a href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Login
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
