import { Link } from "@tanstack/react-router";
import { Icon } from "../../ui/icon/index";
import { ChartBarIcon, ChartLineIcon, ChartPieSliceIcon, CpuIcon, DatabaseIcon, FileSqlIcon, FileTextIcon, FolderOpenIcon, GearIcon, ShieldIcon, UsersIcon } from "@phosphor-icons/react";

let menu_items = [
    {
        route: "dashboard/list-dashboards",
        icon: <ChartBarIcon size={22} className="mr-2 inline-block" />,
        routeName: "My Dashboards",
        admin_only: false,
    },
    {
        route: "admin/dashboards",
        icon: <ChartLineIcon size={22} className="mr-2 inline-block" />,
        routeName: "Dashboards",
        admin_only: true,
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
        route: "admin/workspaces",
        icon: <ChartPieSliceIcon size={22} className="mr-2 inline-block" />,
        routeName: "Workspaces",
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
        route: "admin/settings",
        icon: <GearIcon size={22} className="mr-2 inline-block" />,
        routeName: "Settings",
        admin_only: false,
    },
];

interface MenuItemsProps {
    route: string;
    icon: React.ReactNode;
    routeName: string;
    admin_only?: boolean;
}

const MenuItems = ({ route, icon, routeName, admin_only }: MenuItemsProps) => {
    return (<li>
        <Link
            to={`/${route}` as any}
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
    </li>)
}

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
                    <MenuItems key={item.route} {...item} />
                ))}
            </ul>
        </aside>
    );
};
