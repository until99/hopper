import { useState, useEffect } from "react";
import { api, type APIPowerBIReport } from "../services/Dashboards";
import { type Dashboard } from "../interfaces/dashboard";

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const res = await api.getReports();
      console.log("Raw API response:", res);

      let reports: APIPowerBIReport[] = res || [];

      console.log("Processed reports:", reports);

      const dashboards = reports.map((report) => {
        const dashboardId = report.id;
        const title = report.name;
        const description = report.description || "No description available";
        const workspace = report.workspace_name || "Unknown Workspace";
        const workspaceId = report.workspace_id || "";
        const category = "Not Categorized"; // Definir uma lógica para categorização
        const categoryColor = "slate" as const; // Definir regra
        return {
          dashboardId,
          title,
          description,
          workspace,
          workspaceId,
          category,
          categoryColor,
        };
      });

      setDashboards(dashboards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching dashboards:", err);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const refetchDashboards = () => fetchDashboards(true);

  const deleteDashboard = async (dashboard: Dashboard) => {
    try {
      if (!dashboard.workspaceId) {
        throw new Error("Workspace ID not available for this dashboard");
      }

      await api.deleteReport(dashboard.workspaceId, dashboard.dashboardId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  return {
    dashboards,
    loading,
    refreshing,
    error,
    refetch: refetchDashboards,
    deleteDashboard,
  };
};
