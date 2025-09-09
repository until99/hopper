import { useState, useEffect } from "react";
import {
  api,
  type PowerBIReport,
} from "../services/Dashboards";
import { type Dashboard } from "../interfaces/dashboard";

const mapReportToDashboard = (report: PowerBIReport): Dashboard => ({
  id: report.id,
  title: report.name,
  description: report.description || "No description available",
  workspace: report.workspaceName || "Unknown Workspace",
  workspaceId: report.workspaceId || "",
  category: "Analytics", // Definir uma lógica para categorização
  categoryColor: "blue", // Definir regra
  dashboardId: report.id,
});

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar apenas os relatórios, que agora já incluem informações do workspace
      const reportsResponse = await api.getReports();
      const reports: PowerBIReport[] = reportsResponse.value || [];

      // Mapear relatórios para dashboards
      const mappedDashboards = reports.map((report) => {
        return mapReportToDashboard(report);
      });

      setDashboards(mappedDashboards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching dashboards:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDashboard = async (dashboard: Dashboard) => {
    try {
      // Usar o workspaceId que agora está disponível no dashboard
      if (!dashboard.workspaceId) {
        throw new Error("Workspace ID not available for this dashboard");
      }

      await api.deleteReport(dashboard.workspaceId, dashboard.id);

      // Atualizar a lista local
      setDashboards((prev) => prev.filter((d) => d.id !== dashboard.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete dashboard"
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  return {
    dashboards,
    loading,
    error,
    refetch: fetchDashboards,
    deleteDashboard,
  };
};
