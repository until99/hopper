import { Link } from "@tanstack/react-router";
import { cn } from "../../../lib/utils";

const DashboardCard = ({
  dashboardId,
  title,
  description,
  category,
  categoryColor,
  lastUpdated = "Updated just now",
  className,
  ...props
}) => {
  const colorClassMap = {
    blue: "border-blue-300 bg-blue-200 text-blue-600",
    emerald: "border-emerald-300 bg-emerald-200 text-emerald-600",
    violet: "border-violet-300 bg-violet-200 text-violet-600",
    red: "border-red-300 bg-red-200 text-red-600",
    yellow: "border-yellow-300 bg-yellow-200 text-yellow-600",
  };

  const categoryStyle = cn(
    "h-fit rounded-full px-3 pb-0.5 text-sm font-semibold",
    colorClassMap[categoryColor] ||
      "border-slate-300 bg-slate-200 text-slate-600",
  );

  return (
    <Link
      to="/dashboard/$dashboardId"
      params={{ dashboardId }}
      search={{ dashboardTitle: title, dashboardDescription: description }}
      className={cn("block", className)}
      {...props}
    >
      <div className="flex min-h-50 flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md">
        <div className="flex justify-between align-top">
          <div className="mr-3 flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {description}
            </p>
          </div>
          <div className={categoryStyle}>{category}</div>
        </div>

        <p className="mt-8 text-sm text-slate-500">{lastUpdated}</p>
      </div>
    </Link>
  );
};

export default DashboardCard;
