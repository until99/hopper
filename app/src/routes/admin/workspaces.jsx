import {
  FilePlusIcon,
  UploadIcon,
  XIcon,
  MagnifyingGlassIcon,
  CaretDownIcon,
  FolderIcon,
  ChartBarIcon,
  PencilSimpleIcon,
  TrashIcon,
  CopyIcon,
  PlusIcon,
  FolderPlusIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { dashboards_list } from "../../utils/variables/mockData.jsx";

export const Route = createFileRoute("/admin/workspaces")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showDashboardDialog, setShowDashboardDialog] = useState(false);
  const [showWorkspaceDialog, setShowWorkspaceDialog] = useState(false);
  const [formData, setFormData] = useState({
    pbixFile: null,
    workspace: "",
  });
  const [workspaceFormData, setWorkspaceFormData] = useState({
    name: "",
    description: "",
  });
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [
    showAddDashboardToWorkspaceDialog,
    setShowAddDashboardToWorkspaceDialog,
  ] = useState(false);
  const [selectedDashboardIds, setSelectedDashboardIds] = useState([]);
  const [dashboardSelectionSearchTerm, setDashboardSelectionSearchTerm] =
    useState("");
  const [workspaceListSearch, setWorkspaceListSearch] = useState("");

  const workspaceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        workspaceRef.current &&
        !workspaceRef.current.contains(event.target)
      ) {
        setShowWorkspaceDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkspaceInputChange = (field, value) => {
    setWorkspaceFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateDashboard = () => {
    console.log("Form Data:", formData);
    setShowDashboardDialog(false);
  };

  const handleCreateWorkspace = () => {
    console.log("Workspace Data:", workspaceFormData);
    setShowWorkspaceDialog(false);
    setWorkspaceFormData({ name: "", description: "" });
  };

  const handleEditWorkspace = (workspace) => {
    console.log("Edit workspace:", workspace);
    // Implementar lógica de edição
  };

  const handleDeleteWorkspace = (workspace) => {
    console.log("Delete workspace:", workspace);
    // Implementar lógica de exclusão
  };

  const workspaces = Array.from(
    new Set(dashboards_list.map((dashboard) => dashboard.workspace)),
  );

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.toLowerCase().includes(workspaceSearch.toLowerCase()),
  );

  // Filtrar workspaces para a lista principal
  const filteredWorkspacesList = workspaces.filter((workspace) =>
    workspace.toLowerCase().includes(workspaceListSearch.toLowerCase()),
  );

  // Criar mapeamento de workspace para dashboards
  const workspaceDashboards = {};
  dashboards_list.forEach((dashboard) => {
    if (!workspaceDashboards[dashboard.workspace]) {
      workspaceDashboards[dashboard.workspace] = [];
    }
    workspaceDashboards[dashboard.workspace].push(dashboard);
  });

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
  };

  // Obter dashboards baseado na seleção
  const getSelectedDashboards = () => {
    if (selectedWorkspace) {
      return dashboards_list.filter(
        (dashboard) => dashboard.workspace === selectedWorkspace,
      );
    }
    return [];
  };

  const selectedDashboards = getSelectedDashboards();

  // Filtrar dashboards pela pesquisa
  const filteredDashboards = selectedDashboards.filter(
    (dashboard) =>
      dashboard.title.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      dashboard.description
        .toLowerCase()
        .includes(dashboardSearch.toLowerCase()) ||
      dashboard.category
        .toLowerCase()
        .includes(dashboardSearch.toLowerCase()) ||
      dashboard.workspace.toLowerCase().includes(dashboardSearch.toLowerCase()),
  );

  const handleEditDashboard = (dashboard) => {
    console.log("Edit dashboard:", dashboard);
    // Implementar lógica de edição
  };

  const handleDeleteDashboard = (dashboard) => {
    console.log("Delete dashboard:", dashboard);
    // Implementar lógica de exclusão
  };

  const handleCopyDashboardId = (dashboardId) => {
    navigator.clipboard
      .writeText(dashboardId)
      .then(() => {
        // Aqui você pode adicionar uma notificação de sucesso
        console.log("Dashboard ID copied to clipboard:", dashboardId);
      })
      .catch((err) => {
        console.error("Failed to copy dashboard ID:", err);
      });
  };

  const handleAddDashboardToWorkspace = () => {
    if (!selectedWorkspace) return;
    setShowAddDashboardToWorkspaceDialog(true);
    setSelectedDashboardIds([]);
    setDashboardSelectionSearchTerm("");
  };

  const handleDashboardToggle = (dashboardId) => {
    setSelectedDashboardIds((prev) =>
      prev.includes(dashboardId)
        ? prev.filter((id) => id !== dashboardId)
        : [...prev, dashboardId],
    );
  };

  const handleSelectAllDashboards = () => {
    const filtered = getFilteredAvailableDashboards();
    const allSelected = filtered.every((dashboard) =>
      selectedDashboardIds.includes(dashboard.id),
    );

    if (allSelected) {
      // Deselecionar todos os dashboards filtrados
      setSelectedDashboardIds((prev) =>
        prev.filter((id) => !filtered.some((dashboard) => dashboard.id === id)),
      );
    } else {
      // Selecionar todos os dashboards filtrados
      const newIds = filtered
        .filter((dashboard) => !selectedDashboardIds.includes(dashboard.id))
        .map((dashboard) => dashboard.id);
      setSelectedDashboardIds((prev) => [...prev, ...newIds]);
    }
  };

  const handleConfirmAddDashboards = () => {
    console.log(
      "Add dashboards to workspace:",
      selectedWorkspace,
      selectedDashboardIds,
    );
    // Implementar lógica de adição de dashboards ao workspace
    setShowAddDashboardToWorkspaceDialog(false);
    setSelectedDashboardIds([]);
    setDashboardSelectionSearchTerm("");
  };

  const getAvailableDashboards = () => {
    if (!selectedWorkspace) return [];
    // Retornar dashboards que não estão no workspace selecionado
    return dashboards_list.filter(
      (dashboard) => dashboard.workspace !== selectedWorkspace,
    );
  };

  const getFilteredAvailableDashboards = () => {
    const availableDashboards = getAvailableDashboards();
    if (!dashboardSelectionSearchTerm.trim()) return availableDashboards;

    return availableDashboards.filter(
      (dashboard) =>
        dashboard.title
          .toLowerCase()
          .includes(dashboardSelectionSearchTerm.toLowerCase()) ||
        dashboard.description
          .toLowerCase()
          .includes(dashboardSelectionSearchTerm.toLowerCase()) ||
        dashboard.category
          .toLowerCase()
          .includes(dashboardSelectionSearchTerm.toLowerCase()) ||
        dashboard.workspace
          .toLowerCase()
          .includes(dashboardSelectionSearchTerm.toLowerCase()),
    );
  };
  return (
    <>
      {showWorkspaceDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
            <div className="items-top flex justify-between">
              <div>
                <h2 className="mb-2 text-xl font-bold">Create New Workspace</h2>
                <p className="text-md mb-6 text-gray-500">
                  Create a new workspace to organize your dashboards.
                </p>
              </div>
              <button
                className="flex hover:cursor-pointer"
                onClick={() => setShowWorkspaceDialog(false)}
              >
                <XIcon />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceFormData.name}
                  onChange={(e) =>
                    handleWorkspaceInputChange("name", e.target.value)
                  }
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  placeholder="Enter workspace name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  value={workspaceFormData.description}
                  onChange={(e) =>
                    handleWorkspaceInputChange("description", e.target.value)
                  }
                  className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  placeholder="Enter workspace description"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                onClick={() => setShowWorkspaceDialog(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={handleCreateWorkspace}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showDashboardDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
            <div className="items-top flex justify-between">
              <div>
                <h2 className="mb-2 text-xl font-bold">Upload PBIX File</h2>
                <p className="text-md mb-6 text-slate-500">
                  Upload a Power BI report file to add it to your workspace.
                </p>
              </div>
              <button
                className="flex hover:cursor-pointer"
                onClick={() => setShowDashboardDialog(false)}
              >
                <XIcon />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="h-42 w-full">
                  <input
                    type="file"
                    accept=".pbix"
                    onChange={(e) =>
                      handleInputChange("pbixFile", e.target.files[0])
                    }
                    className="hidden"
                    id="pbixFile"
                  />
                  <label
                    htmlFor="pbixFile"
                    className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-slate-400 hover:bg-slate-50"
                  >
                    <FilePlusIcon className="mr-2 mb-2 size-8" />
                    <p className="text-center">
                      Drag and drop your PBIX file here <br />
                      or click to browse
                    </p>
                  </label>
                </div>

                <label className="text-sm font-semibold">Workspace</label>
                <div className="relative" ref={workspaceRef}>
                  <div
                    className="flex w-full cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white p-2 text-sm"
                    onClick={() =>
                      setShowWorkspaceDropdown(!showWorkspaceDropdown)
                    }
                  >
                    <span
                      className={
                        formData.workspace ? "text-black" : "text-slate-500"
                      }
                    >
                      {formData.workspace || "Select a workspace"}
                    </span>
                    <CaretDownIcon
                      className={`transition-transform ${showWorkspaceDropdown ? `rotate-180` : ``}`}
                    />
                  </div>

                  {showWorkspaceDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                      <div className="p-2">
                        <div className="relative">
                          <MagnifyingGlassIcon className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search workspaces..."
                            value={workspaceSearch}
                            onChange={(e) => setWorkspaceSearch(e.target.value)}
                            className="w-full rounded border border-slate-200 py-1 pr-2 pl-8 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredWorkspaces.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-slate-500">
                            No workspaces found
                          </div>
                        ) : (
                          filteredWorkspaces.map((workspace) => (
                            <div
                              key={workspace}
                              className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-100"
                              onClick={() => {
                                handleInputChange("workspace", workspace);
                                setShowWorkspaceDropdown(false);
                                setWorkspaceSearch("");
                              }}
                            >
                              {workspace}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                onClick={() => setShowDashboardDialog(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={handleCreateDashboard}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddDashboardToWorkspaceDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-bold">
                  Add Dashboards to Workspace
                </h2>
                <p className="text-sm text-gray-500">
                  Select dashboards to add to "{selectedWorkspace}" workspace.
                </p>
              </div>
              <button
                className="flex hover:cursor-pointer"
                onClick={() => setShowAddDashboardToWorkspaceDialog(false)}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboards by title, description, category or workspace..."
                  value={dashboardSelectionSearchTerm}
                  onChange={(e) =>
                    setDashboardSelectionSearchTerm(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {(() => {
                const availableDashboards = getAvailableDashboards();
                const filteredDashboards = getFilteredAvailableDashboards();

                if (availableDashboards.length === 0) {
                  return (
                    <div className="py-8 text-center">
                      <ChartBarIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                      <p className="font-medium text-gray-500">
                        No dashboards available
                      </p>
                      <p className="text-sm text-gray-400">
                        All dashboards are already in this workspace
                      </p>
                    </div>
                  );
                }

                if (filteredDashboards.length === 0) {
                  return (
                    <div className="py-8 text-center">
                      <MagnifyingGlassIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                      <p className="font-medium text-gray-500">
                        No dashboards found
                      </p>
                      <p className="text-sm text-gray-400">
                        Try adjusting your search terms
                      </p>
                    </div>
                  );
                }

                return (
                  <>
                    {/* Select All Option */}
                    <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <input
                        type="checkbox"
                        checked={
                          filteredDashboards.length > 0 &&
                          filteredDashboards.every((dashboard) =>
                            selectedDashboardIds.includes(dashboard.id),
                          )
                        }
                        onChange={handleSelectAllDashboards}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900">
                          Select All ({filteredDashboards.length} dashboards)
                        </div>
                        <div className="text-xs text-blue-700">
                          {selectedDashboardIds.length > 0
                            ? `${selectedDashboardIds.length} selected`
                            : "None selected"}
                        </div>
                      </div>
                    </div>

                    {/* Dashboard List */}
                    <div className="max-h-80 space-y-2 overflow-y-auto">
                      {filteredDashboards.map((dashboard) => (
                        <div
                          key={dashboard.id}
                          className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                            selectedDashboardIds.includes(dashboard.id)
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedDashboardIds.includes(
                              dashboard.id,
                            )}
                            onChange={() => handleDashboardToggle(dashboard.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <ChartBarIcon className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {dashboard.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {dashboard.workspace} • {dashboard.category}
                            </div>
                            {dashboard.description && (
                              <div className="mt-1 truncate text-xs text-slate-400">
                                {dashboard.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-gray-50 px-6 py-4">
              <div className="text-sm text-gray-600">
                {selectedDashboardIds.length > 0 ? (
                  <span className="font-medium">
                    {selectedDashboardIds.length} dashboard
                    {selectedDashboardIds.length !== 1 ? "s" : ""} selected
                  </span>
                ) : (
                  "No dashboards selected"
                )}
              </div>
              <div className="flex gap-3">
                <button
                  className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowAddDashboardToWorkspaceDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className={`rounded px-4 py-2 text-sm font-semibold text-white ${
                    selectedDashboardIds.length > 0
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                  onClick={handleConfirmAddDashboards}
                  disabled={selectedDashboardIds.length === 0}
                >
                  Add{" "}
                  {selectedDashboardIds.length > 0
                    ? selectedDashboardIds.length
                    : ""}{" "}
                  Dashboard{selectedDashboardIds.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <h2 className="text-md text-slate-500">
              Manage your workspaces and dashboards
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="flex h-9 items-center gap-2 rounded-md bg-green-600 px-4 text-sm font-semibold text-white hover:cursor-pointer hover:bg-green-700"
              onClick={() => setShowWorkspaceDialog(true)}
            >
              <FolderPlusIcon /> Create Workspace
            </button>
            <button
              className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:cursor-pointer hover:bg-blue-700"
              onClick={() => setShowDashboardDialog(true)}
            >
              <UploadIcon /> Upload PBIX
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex-1">
            <div className="flex flex-col rounded-t-md border border-slate-200 bg-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-bold">Workspaces</h3>
                  <p className="text-sm text-slate-500">
                    Select a workspace to view dashboards
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar for Workspaces */}
            <div className="border-x border-slate-200 bg-white p-4">
              <div className="relative">
                <MagnifyingGlassIcon
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={workspaceListSearch}
                  onChange={(e) => setWorkspaceListSearch(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  placeholder="Search workspaces..."
                />
              </div>
            </div>

            <div className="flex flex-col rounded-b-md border-x border-b border-slate-200 bg-white p-2">
              {filteredWorkspacesList.map((workspace) => (
                <div key={workspace} className="group mb-3 last:mb-0">
                  <div
                    className={`flex cursor-pointer items-center justify-between rounded-md border-slate-200 p-3 transition-colors hover:bg-slate-100 ${
                      selectedWorkspace === workspace
                        ? "border-blue-200 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleWorkspaceSelect(workspace)}
                  >
                    <div className="flex items-center gap-3">
                      <FolderIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {workspace}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {workspaceDashboards[workspace]?.length || 0}{" "}
                          dashboard
                          {(workspaceDashboards[workspace]?.length || 0) !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer hover:bg-slate-200"
                        onClick={() => handleEditWorkspace(workspace)}
                        title="Edit workspace"
                      >
                        <PencilSimpleIcon
                          size={14}
                          className="text-slate-600"
                        />
                      </button>
                      <button
                        className="rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer hover:bg-red-100"
                        onClick={() => handleDeleteWorkspace(workspace)}
                        title="Delete workspace"
                      >
                        <TrashIcon size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredWorkspacesList.length === 0 && workspaceListSearch && (
                <div className="py-8 text-center">
                  <MagnifyingGlassIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="font-medium text-slate-500">
                    No workspaces found
                  </p>
                  <p className="text-sm text-slate-400">
                    No workspaces match your search criteria: "
                    {workspaceListSearch}"
                  </p>
                </div>
              )}

              {workspaces.length === 0 && !workspaceListSearch && (
                <div className="py-8 text-center">
                  <FolderIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="font-medium text-slate-500">
                    No workspaces found
                  </p>
                  <p className="text-sm text-slate-400">
                    Upload a PBIX file to create your first workspace
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="w-3/4 rounded-lg border border-slate-200 bg-white p-6">
            {selectedWorkspace ? (
              <div>
                <div className="mb-4 border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Workspace: {selectedWorkspace}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Showing all dashboards in the {selectedWorkspace}{" "}
                        workspace
                      </p>
                      <div className="mt-2 text-xs text-slate-400">
                        {selectedDashboards.length} dashboard
                        {selectedDashboards.length !== 1 ? "s" : ""} found
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        onClick={handleAddDashboardToWorkspace}
                      >
                        <PlusIcon weight="bold" size={14} /> Add Dashboard
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Search Bar */}
                  <div className="relative mb-6">
                    <MagnifyingGlassIcon
                      size={18}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                      placeholder="Search dashboards..."
                      value={dashboardSearch}
                      onChange={(e) => setDashboardSearch(e.target.value)}
                    />
                  </div>

                  {/* Dashboards Table */}
                  {selectedDashboards.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                              <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                <div className="flex items-center">Title</div>
                              </th>
                              <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                <div className="flex items-center">
                                  Description
                                </div>
                              </th>
                              <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                <div className="flex items-center">
                                  Workspace
                                </div>
                              </th>
                              <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                <div className="flex items-center">
                                  Category
                                </div>
                              </th>
                              <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                <div className="flex items-center">
                                  Dashboard ID
                                </div>
                              </th>
                              <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                <div className="flex items-center">Actions</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDashboards.map((dashboard) => (
                              <tr
                                key={dashboard.id}
                                className="border-t border-slate-200 hover:bg-slate-50"
                              >
                                <td className="p-3 text-sm text-black">
                                  <div className="flex items-center gap-3">
                                    <ChartBarIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
                                    <div>
                                      <div className="font-medium">
                                        {dashboard.title}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="max-w-xs p-3 text-sm text-black">
                                  <div
                                    className="truncate"
                                    title={dashboard.description}
                                  >
                                    {dashboard.description}
                                  </div>
                                </td>
                                <td className="p-3 text-sm text-black">
                                  <div className="flex items-center gap-1">
                                    <FolderIcon className="h-4 w-4 text-slate-400" />
                                    {dashboard.workspace}
                                  </div>
                                </td>
                                <td className="p-3 text-sm text-black">
                                  <span
                                    className={`w-fit rounded-full border px-3 py-0.5 text-xs font-semibold ${
                                      dashboard.categoryColor === "blue"
                                        ? "border-blue-400 bg-blue-200 text-blue-700"
                                        : dashboard.categoryColor === "green" ||
                                            dashboard.categoryColor ===
                                              "emerald"
                                          ? "border-green-400 bg-green-200 text-green-700"
                                          : dashboard.categoryColor === "violet"
                                            ? "border-violet-400 bg-violet-200 text-violet-700"
                                            : dashboard.categoryColor ===
                                                "yellow"
                                              ? "border-yellow-400 bg-yellow-200 text-yellow-700"
                                              : "border-slate-400 bg-slate-200 text-slate-700"
                                    }`}
                                  >
                                    {dashboard.category}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-sm text-black">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                      {dashboard.dashboardId.substring(0, 8)}...
                                    </span>
                                    <button
                                      className="rounded p-1 transition-colors hover:cursor-pointer hover:bg-slate-200"
                                      onClick={() =>
                                        handleCopyDashboardId(
                                          dashboard.dashboardId,
                                        )
                                      }
                                      title={`Copy full ID: ${dashboard.dashboardId}`}
                                    >
                                      <CopyIcon
                                        size={14}
                                        className="text-slate-500 hover:text-slate-700"
                                      />
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3 text-sm text-black">
                                  <div className="flex items-center gap-1">
                                    <button
                                      className="rounded-lg p-2 hover:cursor-pointer hover:bg-slate-200"
                                      onClick={() =>
                                        handleEditDashboard(dashboard)
                                      }
                                      title="Edit dashboard"
                                    >
                                      <PencilSimpleIcon
                                        size={16}
                                        className="text-black"
                                      />
                                    </button>
                                    <button
                                      className="rounded-lg p-2 hover:cursor-pointer hover:bg-slate-200"
                                      onClick={() =>
                                        handleDeleteDashboard(dashboard)
                                      }
                                      title="Delete dashboard"
                                    >
                                      <TrashIcon
                                        size={16}
                                        className="text-red-600"
                                      />
                                    </button>
                                    <Link
                                      to={`/dashboard/${dashboard.dashboardId}`}
                                      params={{
                                        dashboardId: dashboard.dashboardId,
                                      }}
                                      search={{
                                        dashboardTitle: dashboard.title,
                                        dashboardDescription:
                                          dashboard.description,
                                      }}
                                      className="ml-2 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                                    >
                                      View
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {filteredDashboards.length === 0 && dashboardSearch && (
                        <div className="py-8 text-center">
                          <MagnifyingGlassIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                          <p className="font-medium text-slate-500">
                            No dashboards found
                          </p>
                          <p className="text-sm text-slate-400">
                            No dashboards match your search criteria: "
                            {dashboardSearch}"
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <ChartBarIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        No dashboards found
                      </p>
                      <p className="text-sm text-slate-400">
                        No dashboards are available in the {selectedWorkspace}{" "}
                        workspace
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <ChartBarIcon className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">
                  Select a Workspace
                </h3>
                <p className="text-sm text-slate-500">
                  Choose a workspace from the left panel to view its dashboards
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
