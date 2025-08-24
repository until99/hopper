import {
  PlusIcon,
  XIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ChartBarIcon,
  PencilSimpleIcon,
  TrashIcon,
  UserIcon,
  FolderIcon,
  UserPlusIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  groups_list,
  users_list,
  dashboards_list,
} from "../../utils/variables/mockData.jsx";

export const Route = createFileRoute("/admin/groups")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showAddDashboardDialog, setShowAddDashboardDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [],
    dashboards: [],
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableDashboards, setAvailableDashboards] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [selectedDashboardIds, setSelectedDashboardIds] = useState([]);
  const [dashboardSearchTerm, setDashboardSearchTerm] = useState("");
  const [groupSearch, setGroupSearch] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateGroup = () => {
    console.log("Form Data:", formData);
    setShowGroupDialog(false);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  const handleEditGroup = (group) => {
    console.log("Edit group:", group);
    // Implementar lógica de edição
  };

  const handleDeleteGroup = (group) => {
    console.log("Delete group:", group);
    // Implementar lógica de exclusão
  };

  const handleAddMember = () => {
    setShowAddMemberDialog(true);
    setSelectedUserIds([]);
    setMemberSearchTerm("");
    // Obter usuários que não estão no grupo
    if (selectedGroup) {
      const nonMembers = users_list.filter(
        (user) => !selectedGroup.members.includes(user.id),
      );
      setAvailableUsers(nonMembers);
    }
  };

  const handleAddDashboard = () => {
    setShowAddDashboardDialog(true);
    setSelectedDashboardIds([]);
    setDashboardSearchTerm("");
    // Obter dashboards que o grupo não tem acesso
    if (selectedGroup) {
      const nonAccessible = dashboards_list.filter(
        (dashboard) => !selectedGroup.dashboards.includes(dashboard.id),
      );
      setAvailableDashboards(nonAccessible);
    }
  };

  const handleRemoveMember = (userId) => {
    console.log("Remove member:", userId, "from group:", selectedGroup.id);
    // Implementar lógica de remoção
  };

  const handleRemoveDashboard = (dashboardId) => {
    console.log(
      "Remove dashboard access:",
      dashboardId,
      "from group:",
      selectedGroup.id,
    );
    // Implementar lógica de remoção
  };

  const handleUserToggle = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAllUsers = () => {
    const filtered = getFilteredAvailableUsers();
    const allSelected = filtered.every((user) =>
      selectedUserIds.includes(user.id),
    );

    if (allSelected) {
      // Deselecionar todos os usuários filtrados
      setSelectedUserIds((prev) =>
        prev.filter((id) => !filtered.some((user) => user.id === id)),
      );
    } else {
      // Selecionar todos os usuários filtrados
      const newIds = filtered
        .filter((user) => !selectedUserIds.includes(user.id))
        .map((user) => user.id);
      setSelectedUserIds((prev) => [...prev, ...newIds]);
    }
  };

  const handleConfirmAddMembers = () => {
    console.log("Add users to group:", selectedUserIds);
    // Implementar lógica de adição
    setShowAddMemberDialog(false);
    setSelectedUserIds([]);
    setMemberSearchTerm("");
  };

  const getFilteredAvailableUsers = () => {
    if (!memberSearchTerm.trim()) return availableUsers;

    return availableUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(memberSearchTerm.toLowerCase()),
    );
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
    console.log("Grant dashboard access to group:", selectedDashboardIds);
    // Implementar lógica de concessão de acesso
    setShowAddDashboardDialog(false);
    setSelectedDashboardIds([]);
    setDashboardSearchTerm("");
  };

  const getFilteredAvailableDashboards = () => {
    if (!dashboardSearchTerm.trim()) return availableDashboards;

    return availableDashboards.filter(
      (dashboard) =>
        dashboard.title
          .toLowerCase()
          .includes(dashboardSearchTerm.toLowerCase()) ||
        dashboard.description
          .toLowerCase()
          .includes(dashboardSearchTerm.toLowerCase()) ||
        dashboard.category
          .toLowerCase()
          .includes(dashboardSearchTerm.toLowerCase()) ||
        dashboard.workspace
          .toLowerCase()
          .includes(dashboardSearchTerm.toLowerCase()),
    );
  };

  // Obter usuários do grupo selecionado
  const getGroupUsers = () => {
    if (selectedGroup) {
      return users_list.filter((user) =>
        selectedGroup.members.includes(user.id),
      );
    }
    return [];
  };

  // Obter dashboards do grupo selecionado
  const getGroupDashboards = () => {
    if (selectedGroup) {
      return dashboards_list.filter((dashboard) =>
        selectedGroup.dashboards.includes(dashboard.id),
      );
    }
    return [];
  };

  const groupUsers = getGroupUsers();
  const groupDashboards = getGroupDashboards();

  // Filtrar grupos pela pesquisa
  const filteredGroups = groups_list.filter(
    (group) =>
      group.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
      group.description.toLowerCase().includes(groupSearch.toLowerCase()),
  );

  // Filtrar usuários pela pesquisa
  const filteredUsers = groupUsers.filter(
    (user) =>
      user.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearch.toLowerCase()),
  );

  // Filtrar dashboards pela pesquisa
  const filteredDashboards = groupDashboards.filter(
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

  return (
    <>
      {showAddMemberDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-bold">Add Members to Group</h2>
                <p className="text-sm text-gray-500">
                  Select users to add to "{selectedGroup?.name}" group.
                </p>
              </div>
              <button
                className="flex hover:cursor-pointer"
                onClick={() => setShowAddMemberDialog(false)}
              >
                <XIcon />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email or role..."
                  value={memberSearchTerm}
                  onChange={(e) => setMemberSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {(() => {
                const filteredUsers = getFilteredAvailableUsers();

                if (availableUsers.length === 0) {
                  return (
                    <div className="py-8 text-center">
                      <UserIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                      <p className="font-medium text-gray-500">
                        No users available
                      </p>
                      <p className="text-sm text-gray-400">
                        All users are already members of this group
                      </p>
                    </div>
                  );
                }

                if (filteredUsers.length === 0) {
                  return (
                    <div className="py-8 text-center">
                      <MagnifyingGlassIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                      <p className="font-medium text-gray-500">
                        No users found
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
                          filteredUsers.length > 0 &&
                          filteredUsers.every((user) =>
                            selectedUserIds.includes(user.id),
                          )
                        }
                        onChange={handleSelectAllUsers}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900">
                          Select All ({filteredUsers.length} users)
                        </div>
                        <div className="text-xs text-blue-700">
                          {selectedUserIds.length > 0
                            ? `${selectedUserIds.length} selected`
                            : "None selected"}
                        </div>
                      </div>
                    </div>

                    {/* User List */}
                    <div className="max-h-80 space-y-2 overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                            selectedUserIds.includes(user.id)
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => handleUserToggle(user.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <UserIcon className="h-5 w-5 text-slate-400" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {user.fullName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {user.email} • {user.role}
                            </div>
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
                {selectedUserIds.length > 0 ? (
                  <span className="font-medium">
                    {selectedUserIds.length} user
                    {selectedUserIds.length !== 1 ? "s" : ""} selected
                  </span>
                ) : (
                  "No users selected"
                )}
              </div>
              <div className="flex gap-3">
                <button
                  className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowAddMemberDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className={`rounded px-4 py-2 text-sm font-semibold text-white ${
                    selectedUserIds.length > 0
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                  onClick={handleConfirmAddMembers}
                  disabled={selectedUserIds.length === 0}
                >
                  Add {selectedUserIds.length > 0 ? selectedUserIds.length : ""}{" "}
                  Member{selectedUserIds.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddDashboardDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-bold">Add Dashboard Access</h2>
                <p className="text-sm text-gray-500">
                  Grant "{selectedGroup?.name}" group access to dashboards.
                </p>
              </div>
              <button
                className="flex hover:cursor-pointer"
                onClick={() => setShowAddDashboardDialog(false)}
              >
                <XIcon />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboards by title, description, category or workspace..."
                  value={dashboardSearchTerm}
                  onChange={(e) => setDashboardSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {(() => {
                const filteredDashboards = getFilteredAvailableDashboards();

                if (availableDashboards.length === 0) {
                  return (
                    <div className="py-8 text-center">
                      <ChartBarIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                      <p className="font-medium text-gray-500">
                        No dashboards available
                      </p>
                      <p className="text-sm text-gray-400">
                        This group already has access to all dashboards
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
                  onClick={() => setShowAddDashboardDialog(false)}
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
                  Grant Access to{" "}
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

      {showGroupDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
            <div className="items-top flex justify-between">
              <div>
                <h2 className="mb-2 text-xl font-bold">Create New Group</h2>
                <p className="text-md mb-6 text-gray-500">
                  Create a new group and manage user access to dashboards.
                </p>
              </div>
              <button
                className="flex hover:cursor-pointer"
                onClick={() => setShowGroupDialog(false)}
              >
                <XIcon />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  placeholder="Enter group name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  placeholder="Enter group description"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                onClick={() => setShowGroupDialog(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={handleCreateGroup}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>
            <h2 className="text-md text-gray-500">
              Manage user groups and dashboard access
            </h2>
          </div>
          <button
            className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:cursor-pointer hover:bg-blue-700"
            onClick={() => setShowGroupDialog(true)}
          >
            <PlusIcon /> Create Group
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex-1">
            <div className="flex flex-col rounded-t-md border border-slate-200 bg-slate-100 p-6">
              <h3 className="text-md font-bold">Groups</h3>
              <p className="text-sm text-slate-500">
                Select a group to view members and permissions
              </p>
            </div>

            {/* Search Bar for Groups */}
            <div className="border-x border-slate-200 bg-white p-4">
              <div className="relative">
                <MagnifyingGlassIcon
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  placeholder="Search groups by name or description..."
                />
              </div>
            </div>

            <div className="flex flex-col rounded-b-md border-x border-b border-slate-200 bg-white p-2">
              {filteredGroups.map((group) => (
                <div key={group.id} className="group mb-3 last:mb-0">
                  <div
                    className={`flex cursor-pointer items-center justify-between rounded-md border-slate-200 p-3 transition-colors hover:bg-slate-100 ${
                      selectedGroup?.id === group.id
                        ? "border-blue-200 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleGroupSelect(group)}
                  >
                    <div className="flex items-center gap-3">
                      <UsersIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {group.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {group.members.length} member
                          {group.members.length !== 1 ? "s" : ""} •{" "}
                          {group.dashboards.length} dashboard
                          {group.dashboards.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer hover:bg-slate-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGroup(group);
                        }}
                        title="Edit group"
                      >
                        <PencilSimpleIcon
                          size={14}
                          className="text-slate-600"
                        />
                      </button>
                      <button
                        className="rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group);
                        }}
                        title="Delete group"
                      >
                        <TrashIcon size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredGroups.length === 0 && groupSearch && (
                <div className="py-8 text-center">
                  <MagnifyingGlassIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="font-medium text-slate-500">No groups found</p>
                  <p className="text-sm text-slate-400">
                    No groups match your search criteria: "{groupSearch}"
                  </p>
                </div>
              )}

              {groups_list.length === 0 && !groupSearch && (
                <div className="py-8 text-center">
                  <UsersIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="font-medium text-slate-500">No groups found</p>
                  <p className="text-sm text-slate-400">
                    Create your first group to manage user permissions
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="w-3/4 rounded-lg border border-slate-200 bg-white p-6">
            {selectedGroup ? (
              <div>
                <div className="mb-6 border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Group: {selectedGroup.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {selectedGroup.description}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {activeTab === "members" && (
                        // <button
                        //   className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-1 text-xs font-medium text-white hover:bg-green-700"
                        //   onClick={handleAddMember}
                        // >
                        //   <UserPlusIcon weight="bold" size={14} /> Add Member
                        // </button>

                        <button
                          className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                          onClick={handleAddMember}
                        >
                          <UserPlusIcon weight="bold" size={14} /> Add Member
                        </button>
                      )}
                      {activeTab === "dashboards" && (
                        // <button
                        //   className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        //   onClick={handleAddDashboard}
                        // >
                        //   <PlusIcon weight="bold" size={14} /> Grant Access
                        // </button>

                        <button
                          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          onClick={handleAddDashboard}
                        >
                          <UserPlusIcon weight="bold" size={14} /> Add Dashboard
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-6 text-xs text-slate-400">
                    <span>
                      {groupUsers.length} member
                      {groupUsers.length !== 1 ? "s" : ""}
                    </span>
                    <span>
                      {groupDashboards.length} dashboard
                      {groupDashboards.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <div className="border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <nav className="flex space-x-8">
                        <button
                          className={`pb-2 text-sm font-medium ${
                            activeTab === "members"
                              ? "border-b-2 border-blue-500 text-blue-600"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                          onClick={() => setActiveTab("members")}
                        >
                          Members ({groupUsers.length})
                        </button>
                        <button
                          className={`pb-2 text-sm font-medium ${
                            activeTab === "dashboards"
                              ? "border-b-2 border-blue-500 text-blue-600"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                          onClick={() => setActiveTab("dashboards")}
                        >
                          Dashboards ({groupDashboards.length})
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === "members" ? (
                  <div>
                    {/* Search Bar */}
                    <div className="relative mb-6">
                      <MagnifyingGlassIcon
                        size={18}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                        placeholder="Search members..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>

                    {/* Members Table */}
                    {groupUsers.length > 0 ? (
                      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                  <div className="flex items-center">Name</div>
                                </th>
                                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                  <div className="flex items-center">Email</div>
                                </th>
                                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                  <div className="flex items-center">Role</div>
                                </th>
                                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                  <div className="flex items-center">
                                    Status
                                  </div>
                                </th>
                                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                  <div className="flex items-center">
                                    Last Login
                                  </div>
                                </th>
                                <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                                  <div className="flex items-center">
                                    Actions
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredUsers.map((user) => (
                                <tr
                                  key={user.id}
                                  className="border-t border-slate-200 hover:bg-slate-50"
                                >
                                  <td className="p-3 text-sm text-black">
                                    <div className="flex items-center gap-3">
                                      <UserIcon className="h-5 w-5 flex-shrink-0 text-slate-400" />
                                      <div className="font-medium">
                                        {user.fullName}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3 text-sm text-black">
                                    {user.email}
                                  </td>
                                  <td className="p-3 text-sm text-black">
                                    <span
                                      className={`w-fit rounded-full border px-3 py-0.5 text-xs font-semibold ${
                                        user.role === "Admin"
                                          ? "border-violet-400 bg-violet-200 text-violet-700"
                                          : user.role === "Analyst"
                                            ? "border-blue-400 bg-blue-200 text-blue-700"
                                            : "border-yellow-400 bg-yellow-200 text-yellow-700"
                                      }`}
                                    >
                                      {user.role}
                                    </span>
                                  </td>
                                  <td className="p-3 text-sm text-black">
                                    <span
                                      className={`w-fit rounded-full border px-3 py-0.5 text-xs font-semibold ${
                                        user.isActive
                                          ? "border-green-400 bg-green-200 text-green-700"
                                          : "border-gray-400 bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                  </td>
                                  <td className="p-3 text-sm text-black">
                                    {user.lastLogin}
                                  </td>
                                  <td className="p-3 text-sm text-black">
                                    <button
                                      className="rounded-lg p-2 hover:cursor-pointer hover:bg-slate-200"
                                      onClick={() =>
                                        handleRemoveMember(user.id)
                                      }
                                      title="Remove from group"
                                    >
                                      <XIcon
                                        size={14}
                                        className="text-red-600"
                                      />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {filteredUsers.length === 0 && userSearch && (
                          <div className="py-8 text-center">
                            <MagnifyingGlassIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p className="font-medium text-gray-500">
                              No members found
                            </p>
                            <p className="text-sm text-gray-400">
                              No members match your search criteria: "
                              {userSearch}"
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <UserIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p className="font-medium text-gray-500">No members</p>
                        <p className="text-sm text-gray-400">
                          This group doesn't have any members yet
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
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
                    {groupDashboards.length > 0 ? (
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
                                    Actions
                                  </div>
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
                                      <FolderIcon className="h-4 w-4 text-gray-400" />
                                      {dashboard.workspace}
                                    </div>
                                  </td>
                                  <td className="p-3 text-sm text-black">
                                    <span
                                      className={`w-fit rounded-full border px-3 py-0.5 text-xs font-semibold ${
                                        dashboard.categoryColor === "blue"
                                          ? "border-blue-400 bg-blue-200 text-blue-700"
                                          : dashboard.categoryColor ===
                                                "green" ||
                                              dashboard.categoryColor ===
                                                "emerald"
                                            ? "border-green-400 bg-green-200 text-green-700"
                                            : dashboard.categoryColor ===
                                                "violet"
                                              ? "border-violet-400 bg-violet-200 text-violet-700"
                                              : dashboard.categoryColor ===
                                                  "yellow"
                                                ? "border-yellow-400 bg-yellow-200 text-yellow-700"
                                                : "border-gray-400 bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {dashboard.category}
                                    </span>
                                  </td>
                                  <td className="p-3 text-sm text-black">
                                    <button
                                      className="rounded-lg p-2 hover:cursor-pointer hover:bg-slate-200"
                                      onClick={() =>
                                        handleRemoveDashboard(dashboard.id)
                                      }
                                      title="Remove access"
                                    >
                                      <XIcon
                                        size={14}
                                        className="text-red-600"
                                      />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {filteredDashboards.length === 0 && dashboardSearch && (
                          <div className="py-8 text-center">
                            <MagnifyingGlassIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p className="font-medium text-gray-500">
                              No dashboards found
                            </p>
                            <p className="text-sm text-gray-400">
                              No dashboards match your search criteria: "
                              {dashboardSearch}"
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <ChartBarIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p className="font-medium text-gray-500">
                          No dashboard access
                        </p>
                        <p className="text-sm text-gray-400">
                          This group doesn't have access to any dashboards yet
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <UsersIcon className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">
                  Select a Group
                </h3>
                <p className="text-sm text-slate-500">
                  Choose a group from the left panel to view its members and
                  dashboard permissions
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
