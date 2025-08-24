import { useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import WorkspaceGroup from "./WorkspaceGroup";
import EmptyState from "./EmptyState";
import useDashboardFilters from "../hooks/useDashboardFilters";

const DashboardList = ({ dashboards }) => {
  const {
    searchQuery,
    setSearchQuery,
    groupedDashboards,
    toggleWorkspaceCollapse,
    isWorkspaceCollapsed,
    clearSearch,
    hasResults,
  } = useDashboardFilters(dashboards);

  // Handle page reload after authentication
  useEffect(() => {
    const currentPath = window.location.pathname;
    const previousPath = document.referrer;

    if (
      previousPath.includes("/auth/login") ||
      previousPath.includes("/auth/register")
    ) {
      if (!sessionStorage.getItem("pageReloaded")) {
        sessionStorage.setItem("pageReloaded", "true");
        window.location.reload();
      }
    }
  }, []);

  const totalDashboards = dashboards.length;
  const filteredCount = Object.values(groupedDashboards).reduce(
    (acc, workspaceDashboards) => acc + workspaceDashboards.length,
    0,
  );

  return (
    <section className="p-4">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultsCount={filteredCount}
        totalCount={totalDashboards}
      />

      <div className="mt-6 space-y-5">
        {!hasResults ? (
          <EmptyState
            title={
              searchQuery ? "No dashboards found" : "No dashboards available"
            }
            description={
              searchQuery
                ? "No dashboards found matching your search criteria."
                : "There are no dashboards available at the moment."
            }
            showClearButton={!!searchQuery}
            onClear={clearSearch}
          />
        ) : (
          Object.entries(groupedDashboards).map(
            ([workspace, workspaceDashboards]) => (
              <WorkspaceGroup
                key={workspace}
                workspace={workspace}
                dashboards={workspaceDashboards}
                isCollapsed={isWorkspaceCollapsed(workspace)}
                onToggleCollapse={toggleWorkspaceCollapse}
              />
            ),
          )
        )}
      </div>
    </section>
  );
};

export default DashboardList;
