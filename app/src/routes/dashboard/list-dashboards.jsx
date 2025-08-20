import { createFileRoute, Link } from "@tanstack/react-router";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";

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
      <div className="rounded-lg border border-slate-200 bg-white p-4">
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

function RouteComponent() {
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
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
            placeholder="Search dashboards..."
          />
        </div>

        <div className="grid w-full grid-cols-3 grid-rows-1 gap-2">
          <ReportCard
            dashboardId="sales-overview"
            title="Sales Overview"
            description="Monthly sales performance by region"
            category="Sales"
            categoryColor="blue"
          />
          <ReportCard
            dashboardId="marketing-insights"
            title="Marketing Insights"
            description="Effectiveness of marketing campaigns"
            category="Marketing"
            categoryColor="emerald"
          />
          <ReportCard
            dashboardId="eba69c33-25be-4395-822a-aee72a1dd286"
            title="Gender Distribution Report"
            description="Gender distribution of users"
            category="Product"
            categoryColor="violet"
          />
        </div>
      </section>
    </>
  );
}
