import { createFileRoute, Navigate } from "@tanstack/react-router";
import authentication from "../store/auth/authentication";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const isAuthenticated = authentication.isUserAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/list-dashboards" />;
  } else {
    return <Navigate to="/auth/login" />;
  }
}
