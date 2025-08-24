import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboards")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/dashboards"!</div>;
}
