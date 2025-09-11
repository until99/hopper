import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router"
import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/auth/useAuth";

import { NotFoundPage } from "./not-found"
import { LoginPage } from "./login"

function RootComponent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Aguarda o carregamento inicial completar
    if (loading) return;

    // Marca que a inicialização foi completada
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
    }

    // Só redireciona para login se:
    // 1. Não está autenticado
    // 2. Não está na página de login
    // 3. A inicialização foi completada
    if (!isAuthenticated && 
        window.location.pathname !== '/login' && 
        hasInitializedRef.current) {
      router.navigate({ to: '/login', replace: true });
    }
  }, [isAuthenticated, loading, router]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Outlet />
    );
  }

  return <LoginPage />
};

function NotFoundComponent() {
  return (
    <NotFoundPage />
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});