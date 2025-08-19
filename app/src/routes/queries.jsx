import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/queries")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/queries"!</div>;
}
