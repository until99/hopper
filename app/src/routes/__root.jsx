import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

import {
  CpuIcon,
  ShieldIcon,
  BellIcon,
  FolderOpenIcon,
  FileTextIcon,
  GearIcon,
  UsersIcon,
  FileSqlIcon,
  ChartPieSliceIcon,
  ChartBarIcon,
  DatabaseIcon,
} from "@phosphor-icons/react";

import { useState } from "react";

let menu_items = [
  {
    route: "dashboard/list-dashboards",
    icon: <ChartBarIcon size={22} className="mr-2 inline-block" />,
    routeName: "My Dashboards",
    admin_only: false,
  },
  {
    route: "admin/users",
    icon: <UsersIcon size={22} className="mr-2 inline-block" />,
    routeName: "Users",
    admin_only: true,
  },
  {
    route: "admin/groups",
    icon: <FolderOpenIcon size={22} className="mr-2 inline-block" />,
    routeName: "Groups",
    admin_only: true,
  },
  {
    route: "reports/list-reports",
    icon: <FileTextIcon size={22} className="mr-2 inline-block" />,
    routeName: "My Reports",
    admin_only: false,
  },
  {
    route: "admin/reports",
    icon: <FileSqlIcon size={22} className="mr-2 inline-block" />,
    routeName: "Reports",
    admin_only: true,
  },
  {
    route: "admin/databases",
    icon: <DatabaseIcon size={22} className="mr-2 inline-block" />,
    routeName: "Databases",
    admin_only: true,
  },
  {
    route: "admin/workspaces",
    icon: <ChartPieSliceIcon size={22} className="mr-2 inline-block" />,
    routeName: "Workspaces",
    admin_only: true,
  },
  {
    route: "admin/settings",
    icon: <GearIcon size={22} className="mr-2 inline-block" />,
    routeName: "Settings",
    admin_only: false,
  },
];

function MenuItems({ route, icon, routeName, admin_only }) {
  return (
    <li>
      <Link
        to={`/${route}`}
        className="focus:ring-none flex items-center justify-between rounded-lg p-3 text-sm font-semibold text-nowrap text-white hover:bg-slate-800 focus:bg-blue-600 focus:outline-none"
      >
        <div className="flex items-center">
          {icon}
          <p>{routeName}</p>
        </div>
        {admin_only && (
          <ShieldIcon size={14} className="ml-21 inline-block text-blue-400" />
        )}
      </Link>
    </li>
  );
}

export const Route = createRootRoute({
  component: () => {
    const [showNotificationDropdown, setShowNotificationDropdown] =
      useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    return (
      <>
        <div className="flex bg-slate-50 scrollbar-thumb-sky-700 scrollbar-track-sky-300">
          <aside className="border-r bg-slate-900">
            <div className="flex h-16 items-center gap-4 border-b border-slate-200 bg-slate-900 p-4">
              <CpuIcon
                size={32}
                className="rounded-lg bg-blue-500 p-2 text-white"
              />
              <h1 className="text-2xl font-bold text-white">Hopper</h1>
            </div>
            <ul className="p-2">
              {menu_items.map(({ ...item }) => (
                <MenuItems key={item.route} {...item} />
              ))}
            </ul>
          </aside>
          <main className="min-h-screen w-screen overflow-y-auto">
            <nav className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white p-4">
              <a
                href="#"
                className="rounded-full bg-red-300 px-4 py-0.5 text-sm font-semibold text-red-800"
              >
                Development
              </a>
              <div className="flex items-center">
                {/* Bell Dropdown */}
                <div className="relative inline-block text-left">
                  <button
                    className="rounded-lg p-3 hover:cursor-pointer hover:bg-slate-200"
                    onClick={() => setShowNotificationDropdown((show) => !show)}
                    type="button"
                  >
                    <BellIcon size={18} />
                  </button>
                  {showNotificationDropdown && (
                    <div className="absolute right-0 z-10 mt-1 w-80 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden">
                      <div>
                        <p className="px-4 py-2 text-sm font-bold">
                          Notifications
                        </p>
                        <hr className="border-gray-200 px-2" />
                        <a
                          href="#"
                          className="block truncate px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                          style={{ maxWidth: "100%" }}
                          title='ETL Job "Data Warehouse Load" failed'
                        >
                          ETL Job "Data Warehouse Load" failed
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown*/}
                <button
                  className="relative inline-block rounded-lg px-4 py-1.5 text-left hover:cursor-pointer hover:bg-slate-200"
                  onClick={() => setShowUserDropdown((show) => !show)}
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-200"></div>
                    <div className="flex flex-col">
                      <p className="-mb-1 text-sm font-semibold">
                        Gabriel Kasten
                      </p>
                      <p className="text-xs text-gray-500">Admin</p>
                    </div>
                  </div>

                  {showUserDropdown && (
                    <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden">
                      <div>
                        <p className="px-4 py-2 text-sm font-bold">Profile</p>
                        <hr className="border-gray-100 px-2" />

                        <Link
                          className="block truncate px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                          to="/account/profile"
                        >
                          Profile
                        </Link>

                        <Link
                          className="block truncate px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                          to="/account/settings"
                        >
                          Settings
                        </Link>
                        <hr className="border-gray-100 px-2" />
                        <button
                          className="block w-full truncate px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                          onClick={() => {
                            // Handle sign out logic here
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </nav>
            <Outlet />
          </main>
        </div>
      </>
    );
  },
});
