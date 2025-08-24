import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DatabaseIcon,
  FunnelIcon,
} from "@phosphor-icons/react";

// Import UI components
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import PageHeader from "../../components/ui/PageHeader";

import {
  sql_queries,
  databases,
  users_list,
} from "../../utils/variables/mockData.jsx";

export const Route = createFileRoute("/admin/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    database: "",
    query: "",
    category: "Analytics",
    categoryColor: "blue",
    workspace: "",
  });

  const [queries, setQueries] = useState(sql_queries);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateQuery = () => {
    if (formData.name && formData.query && formData.database) {
      const bindVariables = parseBindVariables(formData.query);

      if (selectedQuery) {
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
        const newQuery = {
          id: Math.max(...queries.map((q) => q.id)) + 1,
          ...formData,
          bindVariables,
          createdBy: 1,
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        };

        setQueries([...queries, newQuery]);
      }

      setFormData({
        name: "",
        description: "",
        database: "",
        query: "",
        category: "Analytics",
        categoryColor: "blue",
        workspace: "",
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
      workspace: query.workspace || "",
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
      <PageHeader title="SQL Reports" subtitle="Manage and execute SQL queries">
        <Button
          variant="default"
          onClick={() => {
            setSelectedQuery(null);
            setFormData({
              name: "",
              description: "",
              database: "",
              query: "",
              category: "Analytics",
              categoryColor: "blue",
              workspace: "",
            });
            setShowQueryDialog(true);
          }}
        >
          <PlusIcon size={16} />
          New Query
        </Button>
      </PageHeader>

      <div className="my-6">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search queries by name, description, category, or database..."
        />
      </div>

      {/* Tabela de Reports */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                  <div className="flex items-center">Name</div>
                </th>
                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                  <div className="flex items-center">Description</div>
                </th>
                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                  <div className="flex items-center">Database</div>
                </th>
                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                  <div className="flex items-center">Category</div>
                </th>
                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                  <div className="flex items-center">Workspace</div>
                </th>
                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                  <div className="flex items-center">Parameters</div>
                </th>
                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                  <div className="flex items-center">Updated</div>
                </th>
                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                  <div className="flex items-center">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((query) => (
                <QueryRow
                  key={query.id}
                  query={query}
                  onEdit={handleEditQuery}
                  onDelete={handleDeleteQuery}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Query Dialog */}
      <Modal
        isOpen={showQueryDialog}
        onClose={() => {
          setShowQueryDialog(false);
          setSelectedQuery(null);
          setFormData({
            name: "",
            description: "",
            database: "",
            query: "",
            category: "Analytics",
            categoryColor: "blue",
            workspace: "",
          });
        }}
        title={selectedQuery ? "Edit Query" : "Create New Query"}
        size="lg"
      >
        <div className="space-y-4">
          <FormField label="Name" required>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Query name"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="2"
              placeholder="Query description"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Database" required>
              <Select
                value={formData.database}
                onChange={(e) => handleInputChange("database", e.target.value)}
              >
                <option value="">Select database</option>
                {databases.map((db) => (
                  <option key={db.id} value={db.name}>
                    {db.name} ({db.type})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Category">
              <Select
                value={formData.category}
                onChange={(e) => {
                  const category = e.target.value;
                  handleInputChange("category", category);
                  handleInputChange(
                    "categoryColor",
                    categoryColors[category] || "blue",
                  );
                }}
              >
                {Object.keys(categoryColors).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Workspace">
            <Input
              type="text"
              value={formData.workspace}
              onChange={(e) => handleInputChange("workspace", e.target.value)}
              placeholder="Workspace name"
            />
          </FormField>

          <FormField label="SQL Query" required>
            <textarea
              value={formData.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="8"
              placeholder="SELECT * FROM table WHERE column = :parameter"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use :parameter_name for bind variables (e.g., :start_date,
              :user_id)
            </p>
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
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
                workspace: "",
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="default" onClick={handleCreateQuery}>
            {selectedQuery ? "Update" : "Create"} Query
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={showDeleteDialog && queryToDelete}
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
            Tem certeza que deseja excluir a query{" "}
            <span className="font-semibold">"{queryToDelete?.name}"</span>?
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

function QueryRow({ query, onEdit, onDelete }) {
  const colorVariantMap = {
    blue: "primary",
    emerald: "success",
    violet: "primary",
    red: "danger",
    yellow: "warning",
  };

  const categoryVariant = colorVariantMap[query.categoryColor] || "default";
  const createdByUser = users_list.find((u) => u.id === query.createdBy);

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="p-3 text-sm text-black">
        <div className="font-medium">{query.name}</div>
      </td>
      <td className="p-3 text-sm text-black">
        <div className="max-w-xs truncate">{query.description}</div>
      </td>
      <td className="p-3 text-sm text-black">
        <div className="flex items-center gap-1">
          <DatabaseIcon size={14} />
          <span>{query.database}</span>
        </div>
      </td>
      <td className="p-3 text-sm text-black">
        <Badge variant={categoryVariant}>{query.category}</Badge>
      </td>
      <td className="p-3 text-sm text-black">
        <Badge variant="default">{query.workspace || "Default"}</Badge>
      </td>
      <td className="p-3 text-sm text-black">
        {query.bindVariables?.length > 0 && (
          <div className="flex items-center gap-1">
            <FunnelIcon size={14} />
            <span>{query.bindVariables.length}</span>
          </div>
        )}
      </td>
      <td className="p-3 text-sm text-black">{query.updatedAt}</td>
      <td className="p-3 text-sm text-black">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(query)}
            className="text-blue-600 hover:bg-blue-100"
          >
            <PencilIcon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(query)}
            className="text-red-600 hover:bg-red-100"
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function QueryCard({ query, onEdit, onDelete }) {
  const colorVariantMap = {
    blue: "primary",
    emerald: "success",
    violet: "primary",
    red: "danger",
    yellow: "warning",
  };

  const categoryVariant = colorVariantMap[query.categoryColor] || "default";
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
        <Badge variant={categoryVariant}>{query.category}</Badge>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          <p>By {createdByUser?.fullName || "Unknown"}</p>
          <p>Updated {query.updatedAt}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(query)}
            className="text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-blue-200"
          >
            <PencilIcon size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(query)}
            className="text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200"
          >
            <TrashIcon size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
