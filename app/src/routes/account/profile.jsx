import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  UserIcon,
  PencilSimpleIcon,
  ShieldIcon,
  ClockIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  BellIcon,
  KeyIcon,
} from "@phosphor-icons/react";

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

  const [editForm, setEditForm] = useState(userData);

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setUserData(editForm);
    setIsEditing(false);
    // Aqui seria feita a chamada para a API para salvar os dados
    console.log("Profile updated:", editForm);
  };

  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
  };

  return (
    <section className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <h2 className="text-md text-gray-500">
            Manage your personal information and preferences
          </h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:cursor-pointer hover:bg-blue-700"
          >
            <PencilSimpleIcon size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <UserIcon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">{userData.fullName}</h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <div className="mt-3 inline-flex items-center gap-1">
                <span
                  className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                    userData.role === "Admin"
                      ? "border-violet-400 bg-violet-200 text-violet-700"
                      : userData.role === "Analyst"
                        ? "border-blue-400 bg-blue-200 text-blue-700"
                        : "border-yellow-400 bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {userData.role}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
                <ClockIcon size={14} />
                <span>Last login: {userData.lastLogin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={editForm.timezone}
                      onChange={(e) => handleInputChange("timezone", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="America/New_York">America/New York</option>
                      <option value="America/Sao_Paulo">America/São Paulo</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={editForm.language}
                      onChange={(e) => handleInputChange("language", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="mt-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Account Status</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${userData.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                <ShieldIcon size={16} className={userData.isActive ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${userData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {userData.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <CalendarIcon size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{userData.joinDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-gray-100">
                <ClockIcon size={16} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Activity</p>
                <p className="font-medium">{userData.lastLogin}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
