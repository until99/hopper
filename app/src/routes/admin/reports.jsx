import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  DatabaseIcon,
  CodeIcon,
  XIcon,
  CheckIcon,
  DownloadIcon,
  FunnelIcon,
} from "@phosphor-icons/react";

import {
  sql_queries,
  databases,
  users_list,
} from "../../utils/variables/mockData";

export const Route = createFileRoute("/admin/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [executeParams, setExecuteParams] = useState({});
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    database: "",
    query: "",
    category: "Analytics",
    categoryColor: "blue",
  });

  const [queries, setQueries] = useState(sql_queries);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateQuery = () => {
    if (formData.name && formData.query && formData.database) {
      // Parse bind variables from query
      const bindVariables = parseBindVariables(formData.query);

      if (selectedQuery) {
        // Editing existing query
        const updatedQuery = {
          ...selectedQuery,
          ...formData,
          bindVariables,
          updatedAt: new Date().toLocaleString(),
        };

        setQueries(
          queries.map((q) => (q.id === selectedQuery.id ? updatedQuery : q)),
        );
      } else {
        // Creating new query
        const newQuery = {
          id: Math.max(...queries.map((q) => q.id)) + 1,
          ...formData,
          bindVariables,
          createdBy: 1, // Current user
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        };

        setQueries([...queries, newQuery]);
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        database: "",
        query: "",
        category: "Analytics",
        categoryColor: "blue",
      });
      setSelectedQuery(null);
      setShowQueryDialog(false);
    }
  };

  const handleEditQuery = (query) => {
    setFormData({
      name: query.name,
      description: query.description,
      database: query.database,
      query: query.query,
      category: query.category,
      categoryColor: query.categoryColor,
    });
    setSelectedQuery(query);
    setShowQueryDialog(true);
  };

  const handleDeleteQuery = (query) => {
    setQueryToDelete(query);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (queryToDelete) {
      setQueries(queries.filter((q) => q.id !== queryToDelete.id));
      setShowDeleteDialog(false);
      setQueryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setQueryToDelete(null);
  };

  const handleExecuteQuery = (query) => {
    setSelectedQuery(query);
    setExecuteParams({});
    setExecutionResult(null);
    setShowExecuteDialog(true);
  };

  const executeQuery = async () => {
    setIsExecuting(true);

    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        columns: ["Column1", "Column2", "Column3"],
        data: [
          ["Value1", "Value2", "Value3"],
          ["Value4", "Value5", "Value6"],
          ["Value7", "Value8", "Value9"],
        ],
        rowCount: 3,
        executionTime: "0.245s",
      };

      setExecutionResult(mockResult);
      setIsExecuting(false);
    }, 2000);
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

  const parseBindVariables = (query) => {
    const matches = query.match(/:(\w+)/g);
    if (!matches) return [];

    const unique = [...new Set(matches)];
    return unique.map((match) => {
      const name = match.substring(1);
      return {
        name,
        type: "string",
        required: true,
        defaultValue: null,
        description: `Parameter ${name}`,
      };
    });
  };

  const filteredQueries = queries.filter((query) => {
    if (!searchQuery.trim()) return true;
    const search = searchQuery.toLowerCase();
    return (
      query.name.toLowerCase().includes(search) ||
      query.description.toLowerCase().includes(search) ||
      query.category.toLowerCase().includes(search) ||
      query.database.toLowerCase().includes(search)
    );
  });

  const categoryColors = {
    Analytics: "blue",
    Sales: "blue",
    Operations: "yellow",
    Finance: "emerald",
    Marketing: "violet",
    HR: "red",
  };

  return (
    <section className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SQL Reports</h1>
          <h2 className="text-md text-gray-500">
            Manage and execute SQL queries
          </h2>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => {
            setSelectedQuery(null);
            setFormData({
              name: "",
              description: "",
              database: "",
              query: "",
              category: "Analytics",
              categoryColor: "blue",
            });
            setShowQueryDialog(true);
          }}
        >
          <PlusIcon size={16} />
          New Query
        </button>
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
          className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none"
          placeholder="Search queries by name, description, category, or database..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredQueries.map((query) => (
          <QueryCard
            key={query.id}
            query={query}
            onEdit={handleEditQuery}
            onDelete={handleDeleteQuery}
            onExecute={handleExecuteQuery}
          />
        ))}
      </div>

      {/* Create/Edit Query Dialog */}
      {showQueryDialog && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {selectedQuery ? "Edit Query" : "Create New Query"}
              </h3>
              <button
                onClick={() => {
                  setShowQueryDialog(false);
                  setSelectedQuery(null);
                  setFormData({
                    name: "",
                    description: "",
                    database: "",
                    query: "",
                    category: "Analytics",
                    categoryColor: "blue",
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="Query name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  rows="2"
                  placeholder="Query description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Database
                  </label>
                  <select
                    value={formData.database}
                    onChange={(e) =>
                      handleInputChange("database", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <option value="">Select database</option>
                    {databases.map((db) => (
                      <option key={db.id} value={db.name}>
                        {db.name} ({db.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const category = e.target.value;
                      handleInputChange("category", category);
                      handleInputChange(
                        "categoryColor",
                        categoryColors[category] || "blue",
                      );
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  >
                    {Object.keys(categoryColors).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SQL Query
                </label>
                <textarea
                  value={formData.query}
                  onChange={(e) => handleInputChange("query", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
                  rows="8"
                  placeholder="SELECT * FROM table WHERE column = :parameter"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use :parameter_name for bind variables (e.g., :start_date,
                  :user_id)
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowQueryDialog(false);
                  setSelectedQuery(null);
                  setFormData({
                    name: "",
                    description: "",
                    database: "",
                    query: "",
                    category: "Analytics",
                    categoryColor: "blue",
                  });
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuery}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                {selectedQuery ? "Update" : "Create"} Query
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && queryToDelete && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-fit max-w-lg rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <TrashIcon size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar exclusão
                </h3>
                <p className="text-sm text-gray-500">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Tem certeza que deseja excluir a query{" "}
                <span className="font-semibold">"{queryToDelete.name}"</span>?
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-lg border border-slate-200 px-4 py-2 text-gray-700 hover:bg-slate-50"
              >
                <p className="text-sm">Cancelar</p>
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                <TrashIcon size={16} weight="bold" />
                <p className="text-sm">Excluir</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function QueryCard({ query, onEdit, onDelete, onExecute }) {
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
    <div className="group rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex justify-between align-top">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{query.name}</h3>
          <p className="text-sm text-gray-500">{query.description}</p>
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

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          <p>By {createdByUser?.fullName || "Unknown"}</p>
          <p>Updated {query.updatedAt}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(query)}
            className="rounded-lg p-2 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-blue-200"
            title="Edit Query"
          >
            <PencilIcon size={14} />
          </button>
          <button
            onClick={() => onDelete(query)}
            className="rounded-lg p-2 text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200"
            title="Delete Query"
          >
            <TrashIcon size={14} />
          </button>
          <button
            onClick={() => onExecute(query)}
            className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
            title="Execute Query"
          >
            <PlayIcon weight="fill" size={14} />
          </button>
        </div>
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
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <CodeIcon size={16} />
            <span className="font-medium">SQL Query</span>
            <span className="text-sm text-gray-500">({query.database})</span>
          </div>
          <pre className="overflow-x-auto rounded border bg-white p-3 text-sm">
            <code>{query.query}</code>
          </pre>
        </div>

        {/* Parameters */}
        {query.bindVariables.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-3 font-medium">Parameters</h4>
            <div className="space-y-3">
              {query.bindVariables.map((param) => (
                <div key={param.name} className="flex flex-col">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {param.name}
                    {param.required && <span className="text-red-500">*</span>}
                  </label>
                  {param.description && (
                    <p className="mb-1 text-xs text-gray-500">
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
                      placeholder={param.description}
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
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlayIcon weight="fill" size={16} />
            {isExecuting ? "Executing..." : "Execute Query"}
          </button>
        </div>

        {/* Results */}
        {isExecuting && (
          <div className="mb-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Executing query...</p>
          </div>
        )}

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
                  disabled={!canExecute || isExecuting}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <DownloadIcon weight="fill" size={16} />
                  {isExecuting ? "Executing..." : "Download CSV"}
                </button>
              </div>
            </div>

            {/* Tabela de Resultados */}
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
