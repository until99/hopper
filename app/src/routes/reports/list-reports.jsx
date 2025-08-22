import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PlayIcon,
  DatabaseIcon,
  FunnelIcon,
  DownloadIcon,
  CodeIcon,
  XIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";

import { sql_queries, users_list } from "../../utils/variables/mockData";

export const Route = createFileRoute("/reports/list-reports")({
  component: RouteComponent,
});

function ReportCard({ query, onExecute }) {
  const colorClassMap = {
    blue: "border-blue-300 bg-blue-200 text-blue-600",
    emerald: "border-emerald-300 bg-emerald-200 text-emerald-600",
    violet: "border-violet-300 bg-violet-200 text-violet-600",
    red: "border-red-300 bg-red-200 text-red-600",
    yellow: "border-yellow-300 bg-yellow-200 text-yellow-600",
  };

  const categoryStyle = `h-fit rounded-full px-3 pb-0.5 text-sm font-semibold ${colorClassMap[query.categoryColor] || "border-gray-300 bg-gray-200 text-gray-600"}`;

  const createdByUser = users_list.find((u) => u.id === query.createdBy);

  return (
    <div className="h-fit rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex justify-between align-top">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{query.name}</h3>
          <p className="line-clamp-2 text-sm text-gray-500">
            {query.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <DatabaseIcon size={14} />
            <span>{query.database}</span>
            {query.bindVariables?.length > 0 && (
              <>
                <span>•</span>
                <FunnelIcon size={14} />
                <span>{query.bindVariables.length} parameters</span>
              </>
            )}
          </div>
        </div>
        <div className={categoryStyle}>{query.category}</div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="text-xs text-gray-400">
          <p>By {createdByUser?.fullName || "Unknown"}</p>
          <p>Updated {query.updatedAt}</p>
        </div>
        <button
          onClick={() => onExecute(query)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
        >
          <PlayIcon weight="fill" size={16} />
          <p className="text-sm">Execute</p>
        </button>
      </div>
    </div>
  );
}

function ExecuteQueryDialog({
  query,
  executeParams,
  setExecuteParams,
  executionResult,
  isExecuting,
  onExecute,
  onDownload,
  onClose,
}) {
  const [isQueryCollapsed, setIsQueryCollapsed] = useState(true);

  const handleParamChange = (paramName, value) => {
    setExecuteParams((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  const canExecute = query.bindVariables.every(
    (param) => !param.required || executeParams[param.name],
  );

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Execute Query: {query.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Query Info */}
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
          <div
            className={`-m-2 flex cursor-pointer justify-between rounded-lg p-2 align-top transition-colors hover:bg-slate-50 ${isQueryCollapsed ? "" : "mb-4"}`}
            onClick={() => setIsQueryCollapsed(!isQueryCollapsed)}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-slate-200">
                {isQueryCollapsed ? (
                  <CaretDownIcon size={16} className="text-slate-600" />
                ) : (
                  <CaretUpIcon size={16} className="text-slate-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <CodeIcon size={16} />
                <span className="font-medium">SQL Query</span>
                <span className="text-sm text-gray-500">
                  ({query.database})
                </span>
              </div>
            </div>
          </div>

          {!isQueryCollapsed && (
            <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <code>{query.query}</code>
            </pre>
          )}
        </div>

        {/* Parameters */}
        {query.bindVariables.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-3 font-medium">Parameters</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {query.bindVariables.map((param) => (
                <div key={param.name} className="flex flex-col">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {param.name}
                    {param.required && <span className="text-red-500">*</span>}
                    {!param.required && (
                      <span className="ml-1 text-xs text-gray-400">
                        (optional)
                      </span>
                    )}
                  </label>
                  {param.description && (
                    <p className="mb-2 text-xs text-gray-500">
                      {param.description}
                    </p>
                  )}
                  {param.type === "select" ? (
                    <select
                      value={
                        executeParams[param.name] || param.defaultValue || ""
                      }
                      onChange={(e) =>
                        handleParamChange(param.name, e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <option value="">Select option</option>
                      {param.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        param.type === "date"
                          ? "date"
                          : param.type === "number"
                            ? "number"
                            : "text"
                      }
                      value={
                        executeParams[param.name] || param.defaultValue || ""
                      }
                      onChange={(e) =>
                        handleParamChange(param.name, e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                      placeholder={param.required ? "Required" : "Optional"}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execute Button */}
        <div className="mb-4">
          <button
            onClick={onExecute}
            disabled={!canExecute || isExecuting}
            className="flex h-9 items-center gap-2 rounded-md bg-green-600 px-4 text-sm font-semibold text-white hover:cursor-pointer hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlayIcon weight="fill" size={16} />
            {isExecuting ? "Executing..." : "Execute Query"}
          </button>
          {!canExecute && query.bindVariables.some((p) => p.required) && (
            <p className="mt-2 text-sm text-red-600">
              Please fill in all required parameters
            </p>
          )}
        </div>

        {/* Loading */}
        {isExecuting && (
          <div className="mb-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Executing query...</p>
          </div>
        )}

        {/* Results */}
        {executionResult && (
          <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium">Results</h4>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {executionResult.rowCount} rows •{" "}
                  {executionResult.executionTime}
                </span>
                <button
                  onClick={onDownload}
                  className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:cursor-pointer hover:bg-blue-700"
                >
                  <DownloadIcon size={16} />
                  Download CSV
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {executionResult.columns.map((col, index) => (
                        <th
                          key={index}
                          className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500"
                        >
                          <div className="flex items-center">{col}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {executionResult.data.map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-slate-200 hover:bg-slate-50"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="p-3 text-sm text-black"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [executeParams, setExecuteParams] = useState({});
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteQuery = (query) => {
    setSelectedQuery(query);
    setExecuteParams({});
    setExecutionResult(null);
    setShowExecuteDialog(true);
  };

  const executeQuery = async () => {
    setIsExecuting(true);

    // Simulate API call with different results based on query
    setTimeout(() => {
      let mockResult;

      if (selectedQuery.id === 1) {
        // Sales Report by Region
        mockResult = {
          columns: ["region", "total_sales", "transactions_count"],
          data: [
            ["North", "1,234,567.89", "856"],
            ["South", "987,654.32", "723"],
            ["East", "2,345,678.90", "1,234"],
            ["West", "876,543.21", "567"],
          ],
          rowCount: 4,
          executionTime: "0.234s",
        };
      } else if (selectedQuery.id === 2) {
        // Customer Performance
        mockResult = {
          columns: [
            "customer_id",
            "customer_name",
            "lifetime_value",
            "total_orders",
            "avg_order_value",
          ],
          data: [
            ["1001", "Acme Corp", "45,678.90", "23", "1,986.90"],
            ["1002", "TechCorp Inc", "32,456.78", "18", "1,803.15"],
            ["1003", "Global Solutions", "67,890.12", "34", "1,996.77"],
            ["1004", "StartUp LLC", "12,345.67", "8", "1,543.21"],
          ],
          rowCount: 4,
          executionTime: "0.156s",
        };
      } else {
        // Inventory Status
        mockResult = {
          columns: [
            "product_code",
            "product_name",
            "current_stock",
            "minimum_stock",
            "stock_status",
          ],
          data: [
            ["P001", "Widget A", "5", "10", "Low Stock"],
            ["P002", "Widget B", "25", "20", "Normal"],
            ["P003", "Widget C", "12", "15", "Warning"],
            ["P004", "Widget D", "50", "25", "Normal"],
          ],
          rowCount: 4,
          executionTime: "0.089s",
        };
      }

      setExecutionResult(mockResult);
      setIsExecuting(false);
    }, 1500);
  };

  const downloadCSV = () => {
    if (!executionResult) return;

    const csv = [
      executionResult.columns.join(","),
      ...executionResult.data.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedQuery.name.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredQueries = sql_queries.filter((query) => {
    if (!searchQuery.trim()) return true;

    const search = searchQuery.toLowerCase().trim();

    // Advanced search patterns
    const descriptionMatch = search.match(/^:des=(.+)$/);
    if (descriptionMatch) {
      return query.description.toLowerCase().includes(descriptionMatch[1]);
    }

    const categoryMatch = search.match(/^:cat=(.+)$/);
    if (categoryMatch) {
      return query.category.toLowerCase().includes(categoryMatch[1]);
    }

    const databaseMatch = search.match(/^:db=(.+)$/);
    if (databaseMatch) {
      return query.database.toLowerCase().includes(databaseMatch[1]);
    }

    // Default search in all fields
    return (
      query.name.toLowerCase().includes(search) ||
      query.description.toLowerCase().includes(search) ||
      query.category.toLowerCase().includes(search) ||
      query.database.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <section className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SQL Reports</h1>
            <h2 className="text-md text-gray-500">
              Execute queries and download results as CSV
            </h2>
          </div>
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            <CodeIcon size={16} />
            Manage Queries
          </Link>
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
            placeholder="Search reports... (Use :des=text for description, :cat=text for category, :db=text for database)"
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQueries.length === 0 ? (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">
                No SQL reports found matching your search.
              </p>
            </div>
          ) : (
            filteredQueries.map((query) => (
              <ReportCard
                key={query.id}
                query={query}
                onExecute={handleExecuteQuery}
              />
            ))
          )}
        </div>
      </section>

      {/* Execute Query Dialog */}
      {showExecuteDialog && selectedQuery && (
        <ExecuteQueryDialog
          query={selectedQuery}
          executeParams={executeParams}
          setExecuteParams={setExecuteParams}
          executionResult={executionResult}
          isExecuting={isExecuting}
          onExecute={executeQuery}
          onDownload={downloadCSV}
          onClose={() => setShowExecuteDialog(false)}
        />
      )}
    </>
  );
}
