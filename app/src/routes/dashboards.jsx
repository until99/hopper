import { createFileRoute, Link } from "@tanstack/react-router";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export const Route = createFileRoute("/dashboards")({
  component: RouteComponent,
});

function ReportCard({
  dashboardId,
  title,
  description,
  category,
  categoryColor,
}) {
  return (
    <Link
      to="/dashboards/$dashboardId"
      params={{ dashboardId }}
    >
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex justify-between align-top">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div
            className={`h-fit rounded-full border border-${categoryColor}-300 bg-${categoryColor}-200 px-3 pb-0.5 text-sm font-semibold text-${categoryColor}-600`}
          >
            {category}
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-500">Updated just now</p>
      </div>
    </Link>
  );
}

function RouteComponent() {
  return (
    <>
      {" "}
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
            dashboardId="user-engagement"
            title="User Engagement"
            description="User activity and engagement metrics"
            category="Product"
            categoryColor="violet"
          />
        </div>
      </section>
    </>
  );
}
