import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { dashboards_list } from "../../utils/variables/mockData";

import {
  MagnifyingGlassIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";

export const Route = createFileRoute("/dashboard/list-dashboards")({
  component: RouteComponent,
});

function ReportCard({
  dashboardId,
  title,
  description,
  category,
  categoryColor,
}) {
  const colorClassMap = {
    blue: "border-blue-300 bg-blue-200 text-blue-600",
    emerald: "border-emerald-300 bg-emerald-200 text-emerald-600",
    violet: "border-violet-300 bg-violet-200 text-violet-600",
    red: "border-red-300 bg-red-200 text-red-600",
    yellow: "border-yellow-300 bg-yellow-200 text-yellow-600",
  };

  const categoryStyle = `h-fit rounded-full px-3 pb-0.5 text-sm font-semibold ${colorClassMap[categoryColor] || ``}`;

  return (
    <Link
      to="/dashboard/$dashboardId"
      params={{ dashboardId: dashboardId }}
      search={{ dashboardTitle: title, dashboardDescription: description }}
    >
      <div className="h-40 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex justify-between align-top">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className={categoryStyle}>{category}</div>
        </div>

        <p className="mt-8 text-sm text-slate-500">Updated just now</p>
      </div>
    </Link>
  );
}

function WorkspaceGroup({
  workspace,
  dashboards,
  isCollapsed,
  onToggleCollapse,
}) {
  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
      <div
        className={`-m-2 flex cursor-pointer justify-between rounded-lg p-2 align-top transition-colors hover:bg-slate-50 ${isCollapsed ? "" : "mb-4"}`}
        onClick={() => onToggleCollapse(workspace)}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-slate-200">
            {isCollapsed ? (
              <CaretDownIcon size={16} className="text-slate-600" />
            ) : (
              <CaretUpIcon size={16} className="text-slate-600" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{workspace}</h3>
            <p className="text-sm text-gray-500">
              {dashboards.length} dashboard{dashboards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="h-fit rounded-full border-slate-300 bg-slate-200 px-3 pb-0.5 text-sm font-semibold text-slate-600">
          Workspace
        </div>
      </div>

      {!isCollapsed && (
        <div className="grid w-full grid-cols-3 gap-2">
          {dashboards.map((dashboard) => (
            <ReportCard
              key={dashboard.dashboardId}
              dashboardId={dashboard.dashboardId}
              title={dashboard.title}
              description={dashboard.description}
              category={dashboard.category}
              categoryColor={dashboard.categoryColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RouteComponent() {
  const [collapsedWorkspaces, setCollapsedWorkspaces] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDashboards = dashboards_list.filter((dashboard) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();

    const descriptionMatch = query.match(/^:des=(.+)$/);
    if (descriptionMatch) {
      return dashboard.description.toLowerCase().includes(descriptionMatch[1]);
    }

    const categoryMatch = query.match(/^:cat=(.+)$/);
    if (categoryMatch) {
      return dashboard.category.toLowerCase().includes(categoryMatch[1]);
    }

    return (
      dashboard.title.toLowerCase().includes(query) ||
      dashboard.description.toLowerCase().includes(query) ||
      dashboard.category.toLowerCase().includes(query)
    );
  });

  const groupedDashboards = filteredDashboards.reduce((groups, dashboard) => {
    const workspace = dashboard.workspace;
    if (!groups[workspace]) {
      groups[workspace] = [];
    }
    groups[workspace].push(dashboard);
    return groups;
  }, {});

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

  return (
    <>
      <section className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboards</h1>
            <h2 className="text-md text-gray-500">
              Select a dashboard to view
            </h2>
          </div>
        </div>

        <div className="relative my-6">
          <MagnifyingGlassIcon
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
            placeholder="Search dashboards... (Use :des=text for description, :cat=text for category)"
          />
        </div>

        <div className="space-y-5">
          {Object.entries(groupedDashboards).length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                No dashboards found matching your search.
              </p>
            </div>
          ) : (
            Object.entries(groupedDashboards).map(([workspace, dashboards]) => (
              <WorkspaceGroup
                key={workspace}
                workspace={workspace}
                dashboards={dashboards}
                isCollapsed={collapsedWorkspaces.has(workspace)}
                onToggleCollapse={toggleWorkspaceCollapse}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}
