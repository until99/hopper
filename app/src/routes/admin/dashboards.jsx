import {
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSimpleIcon,
  XIcon,
  ChartBarIcon,
  FolderIcon,
  CopyIcon,
  UploadIcon,
  FilePlusIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { dashboards_list } from "../../utils/variables/mockData.jsx";

export const Route = createFileRoute("/admin/dashboards")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    pbixFile: null,
    workspace: "",
  });
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

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

  const handleUploadDashboard = () => {
    console.log("Form Data:", formData);
    setShowUploadDialog(false);
    setFormData({ pbixFile: null, workspace: "" });
  };

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
        console.log("Dashboard ID copied to clipboard:", dashboardId);
      })
      .catch((err) => {
        console.error("Failed to copy dashboard ID:", err);
      });
  };

  // Obter workspaces únicos
  const workspaces = Array.from(
    new Set(dashboards_list.map((dashboard) => dashboard.workspace)),
  );

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.toLowerCase().includes(workspaceSearch.toLowerCase()),
  );

  // Filtrar dashboards pela pesquisa
  const filteredDashboards = dashboards_list.filter(
    (dashboard) =>
      dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.workspace.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {showUploadDialog && (
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
                onClick={() => setShowUploadDialog(false)}
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
                onClick={() => setShowUploadDialog(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={handleUploadDashboard}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboards</h1>
            <h2 className="text-md text-slate-500">
              Manage published dashboards and upload new ones
            </h2>
          </div>
          <button
            className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:cursor-pointer hover:bg-blue-700"
            onClick={() => setShowUploadDialog(true)}
          >
            <UploadIcon /> Upload PBIX
          </button>
        </div>

        <div className="relative my-6">
          <MagnifyingGlassIcon
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
            placeholder="Search dashboards by title, description, category or workspace..."
          />
        </div>

        {/* Tabela de Dashboards */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                    <div className="flex items-center">Title</div>
                  </th>
                  <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                    <div className="flex items-center">Description</div>
                  </th>
                  <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                    <div className="flex items-center">Workspace</div>
                  </th>
                  <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                    <div className="flex items-center">Category</div>
                  </th>
                  <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                    <div className="flex items-center">Dashboard ID</div>
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
                        <div className="font-medium">{dashboard.title}</div>
                      </div>
                    </td>
                    <td className="max-w-xs p-3 text-sm text-black">
                      <div className="truncate" title={dashboard.description}>
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
                                dashboard.categoryColor === "emerald"
                              ? "border-green-400 bg-green-200 text-green-700"
                              : dashboard.categoryColor === "violet"
                                ? "border-violet-400 bg-violet-200 text-violet-700"
                                : dashboard.categoryColor === "yellow"
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
                            handleCopyDashboardId(dashboard.dashboardId)
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
                          onClick={() => handleEditDashboard(dashboard)}
                          title="Edit dashboard"
                        >
                          <PencilSimpleIcon size={16} className="text-black" />
                        </button>
                        <button
                          className="rounded-lg p-2 hover:cursor-pointer hover:bg-slate-200"
                          onClick={() => handleDeleteDashboard(dashboard)}
                          title="Delete dashboard"
                        >
                          <TrashIcon size={16} className="text-red-600" />
                        </button>
                        <Link
                          to={`/dashboard/${dashboard.dashboardId}`}
                          params={{
                            dashboardId: dashboard.dashboardId,
                          }}
                          search={{
                            dashboardTitle: dashboard.title,
                            dashboardDescription: dashboard.description,
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

          {filteredDashboards.length === 0 && searchTerm && (
            <div className="py-8 text-center">
              <MagnifyingGlassIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="font-medium text-slate-500">No dashboards found</p>
              <p className="text-sm text-slate-400">
                No dashboards match your search criteria: "{searchTerm}"
              </p>
            </div>
          )}

          {dashboards_list.length === 0 && (
            <div className="py-8 text-center">
              <ChartBarIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="font-medium text-slate-500">No dashboards found</p>
              <p className="text-sm text-slate-400">
                Upload your first PBIX file to get started
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
