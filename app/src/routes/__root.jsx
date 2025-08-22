import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Main } from "../components/layout/Main";
import authentication from "../store/auth/authentication";

export const Route = createRootRoute({
  component: () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const authStatus = authentication.isUserAuthenticated();
        console.log("Checking auth status:", authStatus);
        setIsAuthenticated(authStatus);
        setIsLoading(false);
      };

      // Verificar autenticação inicialmente
      checkAuth();

      // Escutar mudanças no estado de autenticação
      const handleAuthChange = (e) => {
        console.log("Auth status changed:", e.detail.isAuthenticated);
        setIsAuthenticated(e.detail.isAuthenticated);
      };

      // Escutar mudanças no localStorage (para outras abas)
      const handleStorageChange = (e) => {
        if (e.key === "isAuthenticated") {
          checkAuth();
        }
      };

      window.addEventListener("authStatusChanged", handleAuthChange);
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("authStatusChanged", handleAuthChange);
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        </div>
      );
    }

    // Se não estiver autenticado e estiver numa rota de auth, renderizar sem layout
    const currentPath = window.location.pathname;
    const isAuthRoute =
      currentPath === "/auth/login" || currentPath === "/auth/register";

    if (!isAuthenticated && isAuthRoute) {
      return <Outlet />;
    }

    // Se estiver autenticado, renderizar com o layout principal
    if (isAuthenticated) {
      console.log("Rendering with Main layout");
      return (
        <Main>
          <Outlet />
        </Main>
      );
    }

    // Fallback: renderizar apenas o Outlet para rotas não autenticadas
    console.log("Rendering fallback Outlet");
    return <Outlet />;
  },
});
