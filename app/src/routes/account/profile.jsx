import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  UserIcon,
  PencilSimpleIcon,
  ShieldIcon,
  ClockIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import {
  Button,
  Input,
  Select,
  FormField,
  Card,
  PageHeader,
  Badge,
} from "../../components/ui";
import useFormValidation, {
  validationRules,
} from "../../hooks/useFormValidation";

export const Route = createFileRoute("/account/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    role: "Analyst",
    phone: "+1 (555) 123-4567",
    department: "Data Analytics",
    joinDate: "2023-01-15",
    lastLogin: "2023-04-10 08:20",
    isActive: true,
    timezone: "America/New_York",
    language: "en",
  });

  const {
    formData: editForm,
    errors,
    handleChange,
    validateForm,
    setFormData,
  } = useFormValidation(userData, {
    fullName: [validationRules.required, validationRules.minLength(2)],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required],
    department: [validationRules.required],
  });

  const handleSave = () => {
    if (!validateForm()) return;

    setUserData(editForm);
    setIsEditing(false);
    console.log("Profile updated:", editForm);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const startEditing = () => {
    setFormData(userData);
    setIsEditing(true);
  };

  return (
    <section className="p-4">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information and preferences"
      >
        {!isEditing && (
          <Button onClick={startEditing}>
            <PencilSimpleIcon size={16} /> Edit Profile
          </Button>
        )}
      </PageHeader>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <UserIcon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">{userData.fullName}</h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <div className="mt-3 inline-flex items-center gap-1">
                <Badge
                  variant={
                    userData.role === "Admin"
                      ? "primary"
                      : userData.role === "Analyst"
                        ? "success"
                        : "warning"
                  }
                >
                  {userData.role}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
                <ClockIcon size={14} />
                <span>Last login: {userData.lastLogin}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="mb-4 text-lg font-semibold">Profile Information</h3>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <select
                      value={editForm.timezone}
                      onChange={(e) =>
                        handleInputChange("timezone", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="America/New_York">America/New York</option>
                      <option value="America/Sao_Paulo">
                        America/São Paulo
                      </option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      value={editForm.language}
                      onChange={(e) =>
                        handleInputChange("language", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PhoneIcon size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldIcon size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">{userData.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <UserIcon size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{userData.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarIcon size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <p className="font-medium">{userData.joinDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ClockIcon size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Timezone</p>
                      <p className="font-medium">{userData.timezone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Account Status */}
      <div className="mt-6">
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Account Status</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full p-2 ${userData.isActive ? "bg-green-100" : "bg-red-100"}`}
              >
                <ShieldIcon
                  size={16}
                  className={
                    userData.isActive ? "text-green-600" : "text-red-600"
                  }
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p
                  className={`font-medium ${userData.isActive ? "text-green-600" : "text-red-600"}`}
                >
                  {userData.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <CalendarIcon size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{userData.joinDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <ClockIcon size={16} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Activity</p>
                <p className="font-medium">{userData.lastLogin}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
