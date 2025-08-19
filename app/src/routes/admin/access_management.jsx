import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/access_management")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/groups"!</div>;
}
