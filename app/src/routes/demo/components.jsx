import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldIcon,
  BellIcon,
  EyeIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Toggle,
  Modal,
  Card,
  Badge,
  FormField,
  PasswordInput,
  SearchInput,
  PageHeader,
  TabNavigation,
  DataTable,
} from "../../components/ui";
import useFormValidation, {
  validationRules,
} from "../../hooks/useFormValidation";

export const Route = createFileRoute("/demo/components")({
  component: ComponentsDemo,
});

function ComponentsDemo() {
  const [activeTab, setActiveTab] = useState("forms");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toggleState, setToggleState] = useState(false);

  // Form validation example
  const { formData, errors, handleChange, validateForm, resetForm } =
    useFormValidation(
      {
        name: "",
        email: "",
        password: "",
        role: "",
        acceptTerms: false,
      },
      {
        name: [validationRules.required, validationRules.minLength(2)],
        email: [validationRules.required, validationRules.email],
        password: [validationRules.required, validationRules.minLength(6)],
        role: [validationRules.required],
      },
    );

  // Sample data for DataTable
  const sampleUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Analyst",
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Viewer",
      status: "Inactive",
    },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
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
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge variant={value === "Active" ? "success" : "default"}>
          {value}
        </Badge>
      ),
    },
  ];

  const tabs = [
    { id: "forms", label: "Forms", icon: <UserIcon size={16} /> },
    { id: "data", label: "Data Display", icon: <BellIcon size={16} /> },
    { id: "feedback", label: "Feedback", icon: <ShieldIcon size={16} /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      setShowModal(false);
      resetForm();
    }
  };

  return (
    <div className="p-4">
      <PageHeader
        title="Components Demo"
        subtitle="Demonstração de todos os componentes modularizados"
      >
        <Button onClick={() => setShowModal(true)}>
          <PlusIcon size={16} />
          Open Modal
        </Button>
      </PageHeader>

      <div className="mt-8">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="mt-8">
        {activeTab === "forms" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Basic Form Components */}
            <Card>
              <h3 className="mb-6 text-lg font-semibold">Form Components</h3>
              <div className="space-y-4">
                <FormField label="Name" required>
                  <Input
                    placeholder="Enter your name"
                    icon={UserIcon}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={errors.name}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </FormField>

                <FormField label="Email" required>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    icon={EnvelopeIcon}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </FormField>

                <FormField label="Password" required>
                  <PasswordInput
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={errors.password}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </FormField>

                <FormField label="Role">
                  <Select
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="analyst">Analyst</option>
                    <option value="viewer">Viewer</option>
                  </Select>
                </FormField>

                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    handleChange("acceptTerms", e.target.checked)
                  }
                  label="I accept the terms and conditions"
                />

                <div className="flex items-center justify-between pt-4">
                  <Toggle
                    checked={toggleState}
                    onChange={setToggleState}
                    label="Enable notifications"
                  />
                  <Button onClick={(e) => handleSubmit(e)}>Submit</Button>
                </div>
              </div>
            </Card>

            {/* Search Component */}
            <Card>
              <h3 className="mb-6 text-lg font-semibold">Search & Buttons</h3>
              <div className="space-y-4">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  label="Search Demo"
                />

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>

                  <Button loading>Loading Button</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-8">
            {/* Badges */}
            <Card>
              <h3 className="mb-6 text-lg font-semibold">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
              </div>
            </Card>

            {/* Data Table */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Data Table</h3>
              <DataTable columns={columns} data={sampleUsers} />
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <Card>
            <h3 className="mb-6 text-lg font-semibold">Feedback Components</h3>
            <div className="space-y-4">
              <p>
                Modal and other feedback components are demonstrated through
                interactions.
              </p>
              <Button onClick={() => setShowModal(true)}>
                Open Modal Example
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Modal Example */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        subtitle="This is a subtitle for the modal"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Quick Test" required>
            <Input
              placeholder="Test input in modal"
              icon={PhoneIcon}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
