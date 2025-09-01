import { ShieldIcon, type Icon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router"
import { Button } from "../../ui/button";


interface MenuItemsProps {
    route: string;
    routeName: string;
    admin_only?: boolean;
    IconComponent: Icon;
    className?: string;
}

export const MenuItems = ({ route, IconComponent, routeName, admin_only, className }: MenuItemsProps) => {
    return (<li>
        <Link to={route}>
            <Button.Root bgColor="transparent" textColor="text-white" hover hoverColor="bg-blue-600" className={`w-full justify-between font-medium ${className}`}>
                <div className="flex gap-2 items-center">
                    <Button.Icon size={24} IconComponent={IconComponent} />
                    {routeName}
                </div>
                {admin_only && (
                    <Button.IconLeft icon={<ShieldIcon size={16} />} className="ml-21 text-blue-400" />
                )}
            </Button.Root>
        </Link>

        {/* <Link
            to={`/${route}` as any}
            className="focus:ring-none flex items-center justify-between rounded-lg p-3 text-sm font-semibold text-nowrap text-white hover:bg-slate-800 focus:bg-blue-600 focus:outline-none"
        >
            <div className="flex items-center">
                {IconComponent}
                <p>{routeName}</p>
            </div>
            {admin_only && (
                <ShieldIcon size={14} className="ml-21 inline-block text-blue-400" />
            )}
        </Link> */}
    </li>)
}