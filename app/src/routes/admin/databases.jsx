import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DatabaseIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

// Import UI components
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import PageHeader from "../../components/ui/PageHeader";
import PasswordInput from "../../components/ui/PasswordInput";

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
      <PageHeader
        title="Database Connections"
        subtitle="Manage database connections for SQL reports"
      >
        <Button variant="default" onClick={() => setShowDatabaseDialog(true)}>
          <PlusIcon size={16} />
          New Database
        </Button>
      </PageHeader>

      <div className="my-6">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
      <Modal
        isOpen={showDatabaseDialog}
        onClose={resetForm}
        title={
          selectedDatabase
            ? "Edit Database Connection"
            : "Create New Database Connection"
        }
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Name" required>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Database name"
              />
            </FormField>

            <FormField label="Type" required>
              <Select
                value={formData.type}
                onChange={(e) => {
                  handleInputChange("type", e.target.value);
                  handleInputChange(
                    "port",
                    getDefaultPort(e.target.value).toString(),
                  );
                }}
              >
                {databaseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="2"
              placeholder="Database description"
            />
          </FormField>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <FormField label="Host" required>
                <Input
                  type="text"
                  value={formData.host}
                  onChange={(e) => handleInputChange("host", e.target.value)}
                  placeholder="localhost or IP address"
                />
              </FormField>
            </div>

            <FormField label="Port" required>
              <Input
                type="number"
                value={formData.port}
                onChange={(e) => handleInputChange("port", e.target.value)}
                placeholder="Port"
              />
            </FormField>
          </div>

          <FormField label="Database Name" required>
            <Input
              type="text"
              value={formData.database}
              onChange={(e) => handleInputChange("database", e.target.value)}
              placeholder="Database name"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Username">
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Database username"
              />
            </FormField>

            <FormField label="Password">
              <PasswordInput
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Database password"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleCreateDatabase}>
            {selectedDatabase ? "Update" : "Create"} Database
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={showDeleteDialog && databaseToDelete}
        onClose={cancelDelete}
        title="Confirmar exclusão"
        size="md"
        showCloseButton={false}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <TrashIcon size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Esta ação não pode ser desfeita
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700">
            Tem certeza que deseja excluir a conexão{" "}
            <span className="font-semibold">"{databaseToDelete?.name}"</span>?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <TrashIcon size={16} weight="bold" />
            Excluir
          </Button>
        </div>
      </Modal>
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
        <Button
          variant="default"
          size="sm"
          onClick={() => onTestConnection(database)}
          loading={isTestingConnection}
          className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
        >
          {!isTestingConnection && <CheckCircleIcon size={16} />}
          {isTestingConnection ? "Testing..." : "Test Connection"}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(database)}
            className="text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-blue-200"
          >
            <PencilIcon size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(database)}
            className="text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200"
          >
            <TrashIcon size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
