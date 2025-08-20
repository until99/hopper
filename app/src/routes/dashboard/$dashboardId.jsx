import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$dashboardId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { dashboardId } = Route.useParams();

  return <div>Hello "/dashboards/{dashboardId}"!</div>;
}
