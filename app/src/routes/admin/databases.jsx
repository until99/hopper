import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DatabaseIcon,
  XIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

import { databases } from "../../utils/variables/mockData.jsx";

export const Route = createFileRoute("/admin/databases")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showDatabaseDialog, setShowDatabaseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [databaseToDelete, setDatabaseToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({});
  const [testingConnection, setTestingConnection] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    type: "PostgreSQL",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
    description: "",
  });

  const [databaseList, setDatabaseList] = useState(databases);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateDatabase = () => {
    if (formData.name && formData.host && formData.database) {
      const newDatabase = {
        id: Math.max(...databaseList.map((db) => db.id)) + 1,
        ...formData,
        port: parseInt(formData.port) || getDefaultPort(formData.type),
      };

      if (selectedDatabase) {
        // Update existing
        setDatabaseList(
          databaseList.map((db) =>
            db.id === selectedDatabase.id
              ? { ...selectedDatabase, ...formData }
              : db,
          ),
        );
      } else {
        // Create new
        setDatabaseList([...databaseList, newDatabase]);
      }

      resetForm();
    }
  };

  const handleEditDatabase = (database) => {
    setFormData({
      name: database.name,
      type: database.type,
      host: database.host,
      port: database.port.toString(),
      database: database.database,
      username: database.username || "",
      password: "",
      description: database.description,
    });
    setSelectedDatabase(database);
    setShowDatabaseDialog(true);
  };

  const handleDeleteDatabase = (database) => {
    setDatabaseToDelete(database);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (databaseToDelete) {
      setDatabaseList(
        databaseList.filter((db) => db.id !== databaseToDelete.id),
      );
      setShowDeleteDialog(false);
      setDatabaseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDatabaseToDelete(null);
  };

  const testConnection = async (database) => {
    setTestingConnection((prev) => ({ ...prev, [database.id]: true }));

    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setConnectionStatus((prev) => ({
        ...prev,
        [database.id]: {
          success,
          message: success ? "Connection successful" : "Connection failed",
          timestamp: new Date().toLocaleString(),
        },
      }));
      setTestingConnection((prev) => ({ ...prev, [database.id]: false }));
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "PostgreSQL",
      host: "",
      port: "",
      database: "",
      username: "",
      password: "",
      description: "",
    });
    setSelectedDatabase(null);
    setShowDatabaseDialog(false);
  };

  const getDefaultPort = (type) => {
    const ports = {
      PostgreSQL: 5432,
      MySQL: 3306,
      "SQL Server": 1433,
      Oracle: 1521,
      MongoDB: 27017,
    };
    return ports[type] || 5432;
  };

  const filteredDatabases = databaseList.filter((database) => {
    if (!searchQuery.trim()) return true;
    const search = searchQuery.toLowerCase();
    return (
      database.name.toLowerCase().includes(search) ||
      database.type.toLowerCase().includes(search) ||
      database.host.toLowerCase().includes(search) ||
      database.description.toLowerCase().includes(search)
    );
  });

  const databaseTypes = [
    "PostgreSQL",
    "MySQL",
    "SQL Server",
    "Oracle",
    "MongoDB",
    "SQLite",
  ];

  return (
    <section className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Connections</h1>
          <h2 className="text-md text-gray-500">
            Manage database connections for SQL reports
          </h2>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => setShowDatabaseDialog(true)}
        >
          <PlusIcon size={16} />
          New Database
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
          placeholder="Search databases by name, type, host, or description..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDatabases.map((database) => (
          <DatabaseCard
            key={database.id}
            database={database}
            connectionStatus={connectionStatus[database.id]}
            isTestingConnection={testingConnection[database.id]}
            onEdit={handleEditDatabase}
            onDelete={handleDeleteDatabase}
            onTestConnection={testConnection}
          />
        ))}
      </div>

      {/* Create/Edit Database Dialog */}
      {showDatabaseDialog && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {selectedDatabase
                  ? "Edit Database Connection"
                  : "Create New Database Connection"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="Database name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      handleInputChange("type", e.target.value);
                      handleInputChange(
                        "port",
                        getDefaultPort(e.target.value).toString(),
                      );
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  >
                    {databaseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
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
                  placeholder="Database description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Host
                  </label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => handleInputChange("host", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="localhost or IP address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Port
                  </label>
                  <input
                    type="number"
                    value={formData.port}
                    onChange={(e) => handleInputChange("port", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="Port"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Database Name
                </label>
                <input
                  type="text"
                  value={formData.database}
                  onChange={(e) =>
                    handleInputChange("database", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="Database name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="Database username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="Database password"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDatabase}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {selectedDatabase ? "Update" : "Create"} Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && databaseToDelete && (
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
                Tem certeza que deseja excluir a conexão{" "}
                <span className="font-semibold">"{databaseToDelete.name}"</span>
                ?
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

function DatabaseCard({
  database,
  connectionStatus,
  isTestingConnection,
  onEdit,
  onDelete,
  onTestConnection,
}) {
  return (
    <div className="group h-fit rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex justify-between align-top">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <DatabaseIcon size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold">{database.name}</h3>
          </div>
          <p className="text-sm text-gray-500">{database.description}</p>
          <div className="mt-2 space-y-1 text-xs text-gray-400">
            <p>
              <span className="font-medium">Type:</span> {database.type}
            </p>
            <p>
              <span className="font-medium">Host:</span> {database.host}:
              {database.port}
            </p>
            <p>
              <span className="font-medium">Database:</span> {database.database}
            </p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {connectionStatus && (
        <div className="mt-3 rounded-md bg-gray-50 p-2">
          <div className="flex items-center gap-2">
            {connectionStatus.success ? (
              <CheckCircleIcon size={16} className="text-green-600" />
            ) : (
              <XCircleIcon size={16} className="text-red-600" />
            )}
            <span
              className={`text-sm ${connectionStatus.success ? "text-green-600" : "text-red-600"}`}
            >
              {connectionStatus.message}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {connectionStatus.timestamp}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => onTestConnection(database)}
          disabled={isTestingConnection}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isTestingConnection ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              Testing...
            </>
          ) : (
            <>
              <CheckCircleIcon size={16} />
              <p className="text-sm">Test Connection</p>
            </>
          )}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(database)}
            className="rounded-lg p-2 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-blue-200"
            title="Edit Database"
          >
            <PencilIcon size={14} />
          </button>
          <button
            onClick={() => onDelete(database)}
            className="rounded-lg p-2 text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200"
            title="Delete Database"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
