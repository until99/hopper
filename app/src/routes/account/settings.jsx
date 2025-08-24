import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BellIcon,
  ShieldIcon,
  EyeIcon,
  KeyIcon,
  ClockIcon,
  GlobeIcon,
  PaintBrushIcon,
  CheckIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Modal,
  PageHeader,
  TabNavigation,
  Card,
  FormField,
  PasswordInput,
} from "../../components/ui";
import useFormValidation, {
  validationRules,
} from "../../hooks/useFormValidation";

export const Route = createFileRoute("/account/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("preferences");
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  // User Preferences
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("America/New_York");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [reportNotifications, setReportNotifications] = useState(false);
  const [dashboardUpdates, setDashboardUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);

  const {
    formData: passwordForm,
    errors,
    handleChange: handlePasswordChange,
    validateForm,
    resetForm,
  } = useFormValidation(
    {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    {
      currentPassword: [validationRules.required],
      newPassword: [validationRules.required, validationRules.minLength(8)],
      confirmPassword: [
        validationRules.required,
        validationRules.passwordMatch("newPassword"),
      ],
    },
  );

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState("team");
  const [dataSharing, setDataSharing] = useState(false);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);

  const handleChangePassword = () => {
    if (!validateForm()) return;

    // Aqui seria feita a chamada para a API
    console.log("Password change requested");
    setShowChangePasswordDialog(false);
    resetForm();
    alert("Password changed successfully!");
  };

  const handleSaveSettings = () => {
    const settings = {
      theme,
      language,
      timezone,
      dateFormat,
      timeFormat,
      emailNotifications,
      systemAlerts,
      reportNotifications,
      dashboardUpdates,
      securityAlerts,
      twoFactorEnabled,
      sessionTimeout,
      profileVisibility,
      dataSharing,
      analyticsTracking,
    };

    console.log("Settings saved:", settings);
    localStorage.setItem("userAccountSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "preferences", label: "Preferences", icon: <GlobeIcon size={16} /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <BellIcon size={16} />,
    },
    { id: "security", label: "Security", icon: <ShieldIcon size={16} /> },
    { id: "privacy", label: "Privacy", icon: <EyeIcon size={16} /> },
  ];

  return (
    <>
      {/* Change Password Dialog */}
      {showChangePasswordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Change Password</h2>
              <button
                onClick={() => setShowChangePasswordDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("currentPassword", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("newPassword", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowChangePasswordDialog(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <h2 className="text-md text-gray-500">
              Manage your account preferences and privacy settings
            </h2>
          </div>
          <button
            onClick={handleSaveSettings}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Save All Changes
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-slate-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 pb-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Appearance */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <PaintBrushIcon size={20} />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Localization */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <GlobeIcon size={20} />
                  Localization
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
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
                      Date Format
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Time Format
                    </label>
                    <select
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="12">12-hour (AM/PM)</option>
                      <option value="24">24-hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <BellIcon size={20} />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-xs text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      System Alerts
                    </label>
                    <p className="text-xs text-gray-500">
                      Important system notifications
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemAlerts}
                    onChange={(e) => setSystemAlerts(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Report Notifications
                    </label>
                    <p className="text-xs text-gray-500">
                      Updates about reports you follow
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reportNotifications}
                    onChange={(e) => setReportNotifications(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Dashboard Updates
                    </label>
                    <p className="text-xs text-gray-500">
                      Notifications when dashboards are updated
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dashboardUpdates}
                    onChange={(e) => setDashboardUpdates(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Security Alerts
                    </label>
                    <p className="text-xs text-gray-500">
                      Important security-related notifications
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityAlerts}
                    onChange={(e) => setSecurityAlerts(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Password & Authentication */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <KeyIcon size={20} />
                  Password & Authentication
                </h3>
                <div className="space-y-4">
                  <div>
                    <button
                      onClick={() => setShowChangePasswordDialog(true)}
                      className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">
                          Change Password
                        </p>
                        <p className="text-xs text-gray-500">
                          Update your account password
                        </p>
                      </div>
                      <KeyIcon size={16} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Two-Factor Authentication
                      </label>
                      <p className="text-xs text-gray-500">
                        Add an extra layer of security
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                      className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <ClockIcon size={20} />
                  Session Management
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={sessionTimeout}
                      onChange={(e) =>
                        setSessionTimeout(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                  </div>

                  <div>
                    <button className="flex w-full items-center justify-between rounded-lg border border-red-200 p-3 text-red-700 transition-colors hover:bg-red-50">
                      <div className="text-left">
                        <p className="text-sm font-medium">
                          Logout All Sessions
                        </p>
                        <p className="text-xs text-red-500">
                          Sign out from all devices
                        </p>
                      </div>
                      <DesktopIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <EyeIcon size={20} />
                Privacy Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Profile Visibility
                  </label>
                  <select
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public - Everyone can see</option>
                    <option value="team">Team - Only team members</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Data Sharing
                    </label>
                    <p className="text-xs text-gray-500">
                      Allow sharing of usage data for improvement
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dataSharing}
                    onChange={(e) => setDataSharing(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Analytics Tracking
                    </label>
                    <p className="text-xs text-gray-500">
                      Help us improve by tracking app usage
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsTracking}
                    onChange={(e) => setAnalyticsTracking(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Data Export & Deletion
                  </h4>
                  <div className="flex gap-3">
                    <button className="rounded border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">
                      Export My Data
                    </button>
                    <button className="rounded border border-red-300 px-3 py-2 text-xs text-red-700 hover:bg-red-50">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
