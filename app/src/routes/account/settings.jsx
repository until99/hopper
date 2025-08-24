import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellIcon, GlobeIcon, PaintBrushIcon } from "@phosphor-icons/react";
import {
  Button,
  Select,
  Checkbox,
  PageHeader,
  TabNavigation,
  Card,
  FormField,
} from "../../components/ui";

export const Route = createFileRoute("/account/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("preferences");

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
  ];

  return (
    <>
      <section className="p-4">
        <PageHeader
          title="Account Settings"
          subtitle="Manage your account preferences and privacy settings"
        >
          <Button onClick={handleSaveSettings}>Save All Changes</Button>
        </PageHeader>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mt-6"
        />

        <div className="mt-6">
          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Appearance */}
              <Card>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <PaintBrushIcon size={20} />
                  Appearance
                </h3>
                <FormField label="Theme" htmlFor="theme">
                  <Select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </Select>
                </FormField>
              </Card>

              {/* Localization */}
              <Card>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <GlobeIcon size={20} />
                  Localization
                </h3>
                <div className="space-y-4">
                  <FormField label="Language" htmlFor="language">
                    <Select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </Select>
                  </FormField>

                  <FormField label="Timezone" htmlFor="timezone">
                    <Select
                      id="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="America/New_York">America/New York</option>
                      <option value="America/Sao_Paulo">
                        America/São Paulo
                      </option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                      <option value="UTC">UTC</option>
                    </Select>
                  </FormField>

                  <FormField label="Date Format" htmlFor="dateFormat">
                    <Select
                      id="dateFormat"
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </Select>
                  </FormField>

                  <FormField label="Time Format" htmlFor="timeFormat">
                    <Select
                      id="timeFormat"
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                    >
                      <option value="12">12-hour (AM/PM)</option>
                      <option value="24">24-hour</option>
                    </Select>
                  </FormField>
                </div>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <BellIcon size={20} />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <Checkbox
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  label="Email Notifications"
                  description="Receive notifications via email"
                />

                <Checkbox
                  checked={systemAlerts}
                  onChange={(e) => setSystemAlerts(e.target.checked)}
                  label="System Alerts"
                  description="Important system notifications"
                />

                <Checkbox
                  checked={reportNotifications}
                  onChange={(e) => setReportNotifications(e.target.checked)}
                  label="Report Notifications"
                  description="Updates about reports you follow"
                />

                <Checkbox
                  checked={dashboardUpdates}
                  onChange={(e) => setDashboardUpdates(e.target.checked)}
                  label="Dashboard Updates"
                  description="Notifications when dashboards are updated"
                />

                <Checkbox
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                  label="Security Alerts"
                  description="Important security-related notifications"
                />
              </div>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
