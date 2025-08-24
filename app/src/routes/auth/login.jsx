import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../../features/auth";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}
