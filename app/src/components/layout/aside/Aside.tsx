import { Icon } from "../../ui/icon/index";
import { ChartBarIcon, ChartLineIcon, ChartPieSliceIcon, CpuIcon, DatabaseIcon, FileSqlIcon, FileTextIcon, FolderOpenIcon, GearIcon, UsersIcon } from "@phosphor-icons/react";
import { MenuItems } from "./MenuItem";

let menu_items = [
    {
        route: "/app/dashboards/list-dashboards",
        icon: ChartBarIcon,
        routeName: "My Dashboards",
        admin_only: false,
    },
    {
        route: "/app/admin/dashboard",
        icon: ChartLineIcon,
        routeName: "Dashboards",
        admin_only: true,
    },
    {
        route: "/app/admin/user",
        icon: UsersIcon,
        routeName: "Users",
        admin_only: true,
    },
    {
        route: "/app/admin/group",
        icon: FolderOpenIcon,
        routeName: "Groups",
        admin_only: true,
    },
    {
        route: "/app/admin/workspace",
        icon: ChartPieSliceIcon,
        routeName: "Workspaces",
        admin_only: true,
    },
    {
        route: "/app/reports/list-reports",
        icon: FileTextIcon,
        routeName: "My Reports",
        admin_only: false,
    },
    {
        route: "/app/admin/report",
        icon: FileSqlIcon,
        routeName: "Reports",
        admin_only: true,
    },
    {
        route: "/app/admin/database",
        icon: DatabaseIcon,
        routeName: "Databases",
        admin_only: true,
    },
    {
        route: "/app/admin/setting/system",
        icon: GearIcon,
        routeName: "Settings",
        admin_only: false,
    },
];


export const Aside = () => {
    return (
        <aside className="border-r bg-slate-900">
            <div className="flex h-16 items-center gap-4 border-b border-slate-200 bg-slate-900 p-4">
                <Icon.Root size={24} bgColor="blue" icon={CpuIcon} hasHover={false}>
                    <Icon.Button />
                </Icon.Root>
                <h1 className="text-2xl font-bold text-white">Hopper</h1>
            </div>
            <ul className="p-2">
                {menu_items.map(({ ...item }) => (
                    <MenuItems key={item.route} route={item.route} IconComponent={item.icon} routeName={item.routeName} admin_only={item.admin_only} className="mb-2" />
                ))}
            </ul>
        </aside>
    );
};
