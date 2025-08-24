import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { cn } from "../../../lib/utils";
import DashboardCard from "./DashboardCard";

const WorkspaceGroup = ({
  workspace,
  dashboards,
  isCollapsed,
  onToggleCollapse,
  className,
}) => {
  const handleToggle = () => {
    onToggleCollapse(workspace);
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-4",
        className,
      )}
    >
      <div
        className={cn(
          "-m-2 flex cursor-pointer justify-between rounded-lg p-2 align-top transition-colors hover:bg-slate-50",
          !isCollapsed && "mb-4",
        )}
        onClick={handleToggle}
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
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {dashboards.map((dashboard) => (
            <DashboardCard
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
};

export default WorkspaceGroup;
