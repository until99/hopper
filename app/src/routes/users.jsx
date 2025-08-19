import { createFileRoute } from "@tanstack/react-router";

import {
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSimpleIcon,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";

export const Route = createFileRoute("/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Admin",
    isActive: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateUser = () => {
    console.log("Form Data:", formData);
    setShowAddUserDialog(false);
  };

  return (
    <>
      {showAddUserDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
            <div className="items-top flex justify-between">
              <div>
                <h2 className="mb-2 text-xl font-bold">Add New User</h2>
                <p className="text-md mb-6 text-gray-500">
                  Add a new user and set their permissions.
                </p>
              </div>
              <button
                className="flex hover:cursor-pointer"
                onClick={() => setShowAddUserDialog(false)}
              >
                <X />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  placeholder=""
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Email Address</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  placeholder=""
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Role</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm"
                >
                  <option>Admin</option>
                  <option>Analyst</option>
                  <option>Viewer</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">Active Status</p>
                  <p className="text-sm text-slate-400">
                    Allow user to access the system
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                onClick={() => setShowAddUserDialog(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={handleCreateUser}
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
            <h1 className="text-3xl font-bold">Users</h1>
            <h2 className="text-md text-gray-500">
              Manage user access and permissions
            </h2>
          </div>
          <button
            className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:cursor-pointer hover:bg-blue-700"
            onClick={() => setShowAddUserDialog(true)}
          >
            <PlusIcon /> Add User
          </button>
        </div>

        <div className="relative my-6">
          <MagnifyingGlassIcon
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed"
            placeholder="Search users..."
          />
        </div>

        {/* Tabela de Usuários */}
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
                    <div className="flex items-center">Status</div>
                  </th>
                  <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                    <div className="flex items-center">Last Login</div>
                  </th>
                  <th className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500">
                    <div className="flex items-center">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="p-3 text-sm text-black">John Doe</td>
                  <td className="p-3 text-sm text-black">
                    johndoe@example.com
                  </td>
                  <td className="p-3 text-sm text-black">
                    <p className="w-fit rounded-full border border-red-400 bg-red-200 px-4 py-0.5 text-xs font-semibold text-red-700">
                      Analyst
                    </p>
                  </td>
                  <td className="p-3 text-sm text-black">
                    <p className="w-fit rounded-full border border-green-400 bg-green-200 px-4 py-0.5 text-xs font-semibold text-green-700">
                      Active
                    </p>
                  </td>
                  <td className="p-3 text-sm text-black">2023-04-10 08:20</td>
                  <td className="p-3 text-sm text-black">
                    <button className="rounded-lg p-3 hover:cursor-pointer hover:bg-slate-200">
                      <PencilSimpleIcon size={16} className="text-black" />
                    </button>
                    <button className="rounded-lg p-3 hover:cursor-pointer hover:bg-slate-200">
                      <TrashIcon size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
