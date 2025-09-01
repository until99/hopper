import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router"
import { useEffect } from "react";
import { useAuth } from "../hooks/auth/useAuth";

import { NotFoundPage } from "./not-found"
import { LoginPage } from "./login"

function RootComponent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && window.location.pathname !== '/login') {
      router.navigate({ to: '/login', replace: true });
    }
  }, [isAuthenticated, loading, router]);

  if (isAuthenticated) {
    return (
      <Outlet />
    );
  };

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