import { useState, useEffect } from "react";
import { dashboardApi } from "../lib/api";

// Hook para gerenciar dashboards via API
export const useDashboards = () => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all dashboards
  const fetchDashboards = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardApi.getAllDashboards();
      setDashboards(data);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboards");
      console.error("Error fetching dashboards:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search dashboards
  const searchDashboards = async (query) => {
    if (!query.trim()) {
      await fetchDashboards();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await dashboardApi.searchDashboards(query);
      setDashboards(data);
    } catch (err) {
      setError(err.message || "Failed to search dashboards");
      console.error("Error searching dashboards:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create dashboard
  const createDashboard = async (dashboardData) => {
    setLoading(true);
    setError(null);

    try {
      const newDashboard = await dashboardApi.createDashboard(dashboardData);
      setDashboards((prev) => [...prev, newDashboard]);
      return { success: true, data: newDashboard };
    } catch (err) {
      const errorMessage = err.message || "Failed to create dashboard";
      setError(errorMessage);
      console.error("Error creating dashboard:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update dashboard
  const updateDashboard = async (id, dashboardData) => {
    setLoading(true);
    setError(null);

    try {
      await dashboardApi.updateDashboard(id, dashboardData);
      setDashboards((prev) =>
        prev.map((dashboard) =>
          dashboard.id === id ? { ...dashboard, ...dashboardData } : dashboard,
        ),
      );
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Failed to update dashboard";
      setError(errorMessage);
      console.error("Error updating dashboard:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete dashboard
  const deleteDashboard = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await dashboardApi.deleteDashboard(id);
      setDashboards((prev) => prev.filter((dashboard) => dashboard.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Failed to delete dashboard";
      setError(errorMessage);
      console.error("Error deleting dashboard:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboards();
  }, []);

  return {
    dashboards,
    loading,
    error,
    fetchDashboards,
    searchDashboards,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    refetch: fetchDashboards,
  };
};

export default useDashboards;
