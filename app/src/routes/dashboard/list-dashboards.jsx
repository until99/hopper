import { createFileRoute } from "@tanstack/react-router";
import { dashboards_list } from "../../utils/variables/mockData.jsx";
import { DashboardList } from "../../features/dashboard";

export const Route = createFileRoute("/dashboard/list-dashboards")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DashboardList dashboards={dashboards_list} />;
}
