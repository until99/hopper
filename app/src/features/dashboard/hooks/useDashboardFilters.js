import { useState, useMemo } from "react";

const useDashboardFilters = (dashboards) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedWorkspaces, setCollapsedWorkspaces] = useState(new Set());

  const filteredDashboards = useMemo(() => {
    if (!searchQuery.trim()) return dashboards;

    const query = searchQuery.toLowerCase().trim();

    // Advanced search patterns
    const descriptionMatch = query.match(/^:des=(.+)$/);
    if (descriptionMatch) {
      return dashboards.filter((dashboard) =>
        dashboard.description.toLowerCase().includes(descriptionMatch[1]),
      );
    }

    const categoryMatch = query.match(/^:cat=(.+)$/);
    if (categoryMatch) {
      return dashboards.filter((dashboard) =>
        dashboard.category.toLowerCase().includes(categoryMatch[1]),
      );
    }

    const workspaceMatch = query.match(/^:ws=(.+)$/);
    if (workspaceMatch) {
      return dashboards.filter((dashboard) =>
        dashboard.workspace.toLowerCase().includes(workspaceMatch[1]),
      );
    }

    // Default search across all fields
    return dashboards.filter(
      (dashboard) =>
        dashboard.title.toLowerCase().includes(query) ||
        dashboard.description.toLowerCase().includes(query) ||
        dashboard.category.toLowerCase().includes(query) ||
        dashboard.workspace.toLowerCase().includes(query),
    );
  }, [dashboards, searchQuery]);

  const groupedDashboards = useMemo(() => {
    return filteredDashboards.reduce((groups, dashboard) => {
      const workspace = dashboard.workspace;
      if (!groups[workspace]) {
        groups[workspace] = [];
      }
      groups[workspace].push(dashboard);
      return groups;
    }, {});
  }, [filteredDashboards]);

  const toggleWorkspaceCollapse = (workspace) => {
    setCollapsedWorkspaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workspace)) {
        newSet.delete(workspace);
      } else {
        newSet.add(workspace);
      }
      return newSet;
    });
  };

  const isWorkspaceCollapsed = (workspace) => {
    return collapsedWorkspaces.has(workspace);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const expandAllWorkspaces = () => {
    setCollapsedWorkspaces(new Set());
  };

  const collapseAllWorkspaces = () => {
    const allWorkspaces = Object.keys(groupedDashboards);
    setCollapsedWorkspaces(new Set(allWorkspaces));
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredDashboards,
    groupedDashboards,
    toggleWorkspaceCollapse,
    isWorkspaceCollapsed,
    clearSearch,
    expandAllWorkspaces,
    collapseAllWorkspaces,
    hasResults: Object.keys(groupedDashboards).length > 0,
  };
};

export default useDashboardFilters;
