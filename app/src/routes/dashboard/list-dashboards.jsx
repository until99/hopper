import { createFileRoute } from "@tanstack/react-router";
import { dashboards_list } from "../../utils/variables/mockData.jsx";
import { DashboardList } from "../../features/dashboard";
import { useState } from "react";
import { Button } from "../../components/ui";

export const Route = createFileRoute("/dashboard/list-dashboards")({
  component: RouteComponent,
});

function RouteComponent() {
  const [useApi, setUseApi] = useState(false);

  return (
    <div>
      <div className="border-b bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Fonte de Dados</h2>
            <p className="text-sm text-slate-600">
              {useApi
                ? "Dados carregados da API"
                : "Dados mockados (demonstração)"}
            </p>
          </div>
          <Button
            onClick={() => setUseApi(!useApi)}
            variant={useApi ? "default" : "outline"}
          >
            {useApi ? "Usar dados mockados" : "Carregar da API"}
          </Button>
        </div>
      </div>

      {useApi ? (
        <DashboardList />
      ) : (
        <DashboardList dashboards={dashboards_list} />
      )}
    </div>
  );
}
