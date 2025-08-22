import {
  createRootRoute,
  Outlet,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Main } from "../components/layout/Main";
import authentication from "../store/auth/authentication";

export const Route = createRootRoute({
  component: () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const authStatus = authentication.isUserAuthenticated();
        setIsAuthenticated(authStatus);
        setIsLoading(false);

        // Se não estiver autenticado, redirecionar para login
        if (!authStatus && window.location.pathname !== "/auth/login" && window.location.pathname !== "/auth/register") {
          navigate({ to: "/auth/login" });
        }
      };

      checkAuth();
    }, [navigate]);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        </div>
      );
    }

    // Se não estiver autenticado e estiver numa rota de auth, renderizar normalmente
    if (!isAuthenticated && (window.location.pathname === "/auth/login" || window.location.pathname === "/auth/register")) {
      return <Outlet />;
    }

    // Se estiver autenticado, renderizar com o layout principal
    if (isAuthenticated) {
      return (
        <Main>
          <Outlet />
        </Main>
      );
    }

    // Fallback: renderizar apenas o Outlet
    return <Outlet />;
  },
});
