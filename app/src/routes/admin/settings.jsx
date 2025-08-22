import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <h2 className="text-md text-gray-500">
            System settings and configuration
          </h2>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Name
              </label>
              <input
                type="text"
                defaultValue="Hopper"
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Query Timeout (seconds)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Require Authentication
              </label>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Audit Logging
              </label>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
