import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [appName, setAppName] = useState("Hopper");
  const [queryTimeout, setQueryTimeout] = useState(30);
  const [requireAuth, setRequireAuth] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maxConnections, setMaxConnections] = useState(100);
  const [dataRetention, setDataRetention] = useState(30);
  const [unlimitedRetention, setUnlimitedRetention] = useState(false);
  const [cacheSize, setCacheSize] = useState(512);
  const [resultsPerPage, setResultsPerPage] = useState(50);
  const [enableCaching, setEnableCaching] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Update document title when app name changes
  useEffect(() => {
    document.title = `${appName} - Admin Settings`;
  }, [appName]);

  const handleSaveSettings = () => {
    const settings = {
      appName,
      queryTimeout,
      requireAuth,
      auditLogging,
      maintenanceMode,
      autoBackup,
      maxConnections,
      dataRetention,
      unlimitedRetention,
      cacheSize,
      resultsPerPage,
      enableCaching,
    };

    console.log("Settings saved:", settings);
    localStorage.setItem("hopperSettings", JSON.stringify(settings));
    setShowSaveModal(false);
  };

  const handleResetSettings = () => {
    setAppName("Hopper");
    setQueryTimeout(30);
    setRequireAuth(true);
    setAuditLogging(true);
    setMaintenanceMode(false);
    setAutoBackup(true);
    setMaxConnections(100);
    setDataRetention(30);
    setUnlimitedRetention(false);
    setCacheSize(512);
    setResultsPerPage(50);
    setEnableCaching(true);
    setShowResetModal(false);
  };

  return (
    <section className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <h2 className="text-md text-gray-500">
            System settings and configuration
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowResetModal(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Reset to Default
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Settings */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">System Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Application Title
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Enter application title"
              />
              <p className="mt-1 text-xs text-gray-500">
                This will update the browser tab title
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Default Query Timeout (seconds)
              </label>
              <input
                type="number"
                value={queryTimeout}
                onChange={(e) => setQueryTimeout(Number(e.target.value))}
                min="1"
                max="300"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Database Connections
              </label>
              <input
                type="number"
                value={maxConnections}
                onChange={(e) => setMaxConnections(Number(e.target.value))}
                min="10"
                max="1000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Maintenance Mode
              </label>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Audit Logging
              </label>
              <input
                type="checkbox"
                checked={auditLogging}
                onChange={(e) => setAuditLogging(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Data Retention Period (days)
              </label>
              <div className="space-y-3">
                <input
                  type="number"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(Number(e.target.value))}
                  min="1"
                  max="365"
                  disabled={unlimitedRetention}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    unlimitedRetention ? "bg-gray-100 text-gray-500" : ""
                  }`}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="unlimitedRetention"
                    checked={unlimitedRetention}
                    onChange={(e) => setUnlimitedRetention(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="unlimitedRetention"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Keep data indefinitely (ignore retention period)
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Auto Backup
              </label>
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={(e) => setAutoBackup(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
          {/* Performance */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Performance</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cache Size (MB)
                </label>
                <input
                  type="number"
                  value={cacheSize}
                  onChange={(e) => setCacheSize(Number(e.target.value))}
                  min="64"
                  max="2048"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Results Per Page
                </label>
                <select
                  value={resultsPerPage}
                  onChange={(e) => setResultsPerPage(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Enable Query Caching
                </label>
                <input
                  type="checkbox"
                  checked={enableCaching}
                  onChange={(e) => setEnableCaching(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Reset Settings</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to reset all settings to their default values? 
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetSettings}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Save Settings</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to save these settings? The changes will be 
              applied immediately.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
