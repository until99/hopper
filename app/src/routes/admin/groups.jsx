import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/groups")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/groups"!</div>;
}
