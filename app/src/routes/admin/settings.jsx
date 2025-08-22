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
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [queryAlerts, setQueryAlerts] = useState(false);
  const [cacheSize, setCacheSize] = useState(512);
  const [resultsPerPage, setResultsPerPage] = useState(50);
  const [enableCaching, setEnableCaching] = useState(true);

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
      theme,
      language,
      timezone,
      emailNotifications,
      systemAlerts,
      queryAlerts,
      cacheSize,
      resultsPerPage,
      enableCaching
    };
    
    console.log("Settings saved:", settings);
    localStorage.setItem('hopperSettings', JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setAppName("Hopper");
      setQueryTimeout(30);
      setRequireAuth(true);
      setAuditLogging(true);
      setMaintenanceMode(false);
      setAutoBackup(true);
      setMaxConnections(100);
      setDataRetention(30);
      setUnlimitedRetention(false);
      setTheme("light");
      setLanguage("en");
      setTimezone("UTC");
      setEmailNotifications(true);
      setSystemAlerts(true);
      setQueryAlerts(false);
      setCacheSize(512);
      setResultsPerPage(50);
      setEnableCaching(true);
    }
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
            onClick={handleResetSettings}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Settings */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Title
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter application title"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will update the browser tab title
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Query Timeout (seconds)
              </label>
              <input
                type="number"
                value={queryTimeout}
                onChange={(e) => setQueryTimeout(Number(e.target.value))}
                min="1"
                max="300"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Database Connections
              </label>
              <input
                type="number"
                value={maxConnections}
                onChange={(e) => setMaxConnections(Number(e.target.value))}
                min="10"
                max="1000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Require Authentication
              </label>
              <input
                type="checkbox"
                checked={requireAuth}
                onChange={(e) => setRequireAuth(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Audit Logging
              </label>
              <input
                type="checkbox"
                checked={auditLogging}
                onChange={(e) => setAuditLogging(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    unlimitedRetention ? 'bg-gray-100 text-gray-500' : ''
                  }`}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="unlimitedRetention"
                    checked={unlimitedRetention}
                    onChange={(e) => setUnlimitedRetention(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="unlimitedRetention" className="ml-2 text-sm text-gray-700">
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
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Additional Settings Sections */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1">
        {/* Performance */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Performance</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache Size (MB)
              </label>
              <input
                type="number"
                value={cacheSize}
                onChange={(e) => setCacheSize(Number(e.target.value))}
                min="64"
                max="2048"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results Per Page
              </label>
              <select
                value={resultsPerPage}
                onChange={(e) => setResultsPerPage(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
