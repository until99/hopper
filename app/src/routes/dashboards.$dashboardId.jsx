import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboards/$dashboardId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { dashboardId } = Route.useParams();

  return <div>Hello "/dashboards/{dashboardId}"!</div>;
}
