import { createFileRoute } from "@tanstack/react-router";
import {
  PlusIcon,
  TrashIcon,
  PencilSimpleIcon,
  XIcon,
  UserIcon,
  EnvelopeIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { users_list } from "../../utils/variables/mockData.jsx";
import {
  Button,
  Input,
  Select,
  Toggle,
  Modal,
  PageHeader,
  SearchInput,
  FormField,
  Card,
  Badge,
  DataTable,
} from "../../components/ui";
import { createMultiFieldFilter } from "../../lib/filterUtils";
import useFormValidation, {
  validationRules,
} from "../../hooks/useFormValidation";

export const Route = createFileRoute("/admin/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { formData, errors, handleChange, validateForm, resetForm } =
    useFormValidation(
      {
        fullName: "",
        email: "",
        role: "Admin",
        isActive: false,
      },
      {
        fullName: [validationRules.required, validationRules.minLength(2)],
        email: [validationRules.required, validationRules.email],
      },
    );

  const handleCreateUser = () => {
    if (!validateForm()) return;

    console.log("Form Data:", formData);
    setShowAddUserDialog(false);
    resetForm();
  };

  const filteredUsers = users_list.filter(
    createMultiFieldFilter(["fullName", "email", "role"], searchQuery),
  );

  const columns = [
    {
      key: "fullName",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <Badge
          variant={
            value === "Admin"
              ? "primary"
              : value === "Analyst"
                ? "success"
                : "warning"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <Badge variant={value ? "success" : "default"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">
            <PencilSimpleIcon size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <TrashIcon size={16} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        isOpen={showAddUserDialog}
        onClose={() => setShowAddUserDialog(false)}
        title="Add New User"
        subtitle="Add a new user and set their permissions."
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateUser();
          }}
        >
          <FormField label="Full Name" error={errors.fullName} required>
            <Input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              icon={UserIcon}
              placeholder="Enter full name"
              error={errors.fullName}
            />
          </FormField>

          <FormField label="Email Address" error={errors.email} required>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              icon={EnvelopeIcon}
              placeholder="user@example.com"
              error={errors.email}
            />
          </FormField>

          <FormField label="Role">
            <Select
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
              <option value="Viewer">Viewer</option>
            </Select>
          </FormField>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Active Status</p>
              <p className="text-xs text-gray-500">
                Allow user to access the system
              </p>
            </div>
            <Toggle
              checked={formData.isActive}
              onChange={(checked) => handleChange("isActive", checked)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddUserDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>

      <section className="p-4">
        <PageHeader title="Users" subtitle="Manage user access and permissions">
          <Button onClick={() => setShowAddUserDialog(true)}>
            <PlusIcon size={16} /> Add User
          </Button>
        </PageHeader>

        <div className="my-6">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="max-w-md"
          />
        </div>

        {/* Tabela de Usuários */}
        <DataTable
          columns={columns}
          data={filteredUsers}
          emptyMessage="No users found matching your search criteria"
        />
      </section>
    </>
  );
}
