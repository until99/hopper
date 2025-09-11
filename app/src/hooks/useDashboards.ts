import { useState, useEffect } from "react";
import { api, type APIPowerBIReport } from "../services/Dashboards";
import { dashboardApi } from "../services/DashboardApi";
import { type Dashboard } from "../interfaces/dashboard";

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Busca dashboards do PowerBI
      const powerbiReports = await api.getReports();
      console.log("Raw PowerBI reports:", powerbiReports);

      let reports: APIPowerBIReport[] = powerbiReports || [];

      // Busca dashboards com categorias do nosso banco
      const dashboardsWithCategories = await dashboardApi.getAllDashboardsWithCategories();
      console.log("Dashboards with categories:", dashboardsWithCategories);

      // Cria um mapa das categorias por dashboard_id
      const categoryMap = new Map();
      dashboardsWithCategories.forEach(dashboard => {
        if (dashboard.categories && dashboard.categories.length > 0) {
          categoryMap.set(dashboard.dashboard_id, dashboard.categories[0]); // Primeira categoria
        }
      });

      console.log("Category map:", categoryMap);

      const dashboards = reports.map((report) => {
        const dashboardId = report.id;
        const title = report.name;
        const description = report.description || "No description available";
        const workspace = report.workspace_name || "Unknown Workspace";
        const workspaceId = report.workspace_id || "";
        
        // Busca a categoria real do banco
        const categoryData = categoryMap.get(dashboardId);
        const category = categoryData ? categoryData.name : "Not Categorized";
        const categoryColor = categoryData ? categoryData.color : "slate";
        
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

      console.log("Final dashboards:", dashboards);
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

      setDeleting(true);
      setError(null);
      
      await api.deleteReport(dashboard.workspaceId, dashboard.dashboardId);
      
      // Refetch the dashboards to update the table
      await fetchDashboards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error deleting dashboard:", err);
    } finally {
      setDeleting(false);
    }
  };

  const assignCategoryToDashboard = async (dashboardId: string, categoryId: string): Promise<void> => {
    try {
      await dashboardApi.assignCategoryToDashboard(dashboardId, categoryId);
      // Após atribuir, refaz o fetch para atualizar a lista
      await fetchDashboards(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign category");
      console.error("Error assigning category:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  return {
    dashboards,
    loading,
    refreshing,
    deleting,
    error,
    refetch: refetchDashboards,
    deleteDashboard,
    assignCategoryToDashboard,
  };
};
