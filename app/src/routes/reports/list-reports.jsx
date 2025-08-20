import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reports/list-reports")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/list-reports"!</div>;
}
