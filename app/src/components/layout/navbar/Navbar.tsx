import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { useAuth } from "../../../hooks/auth/useAuth";
import { Label } from "../../ui/label/index";

export const Navbar = () => {
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const { user, logout } = useAuth();
    const router = useRouter();

    const handleSignOut = () => {
        logout();
        router.navigate({ to: "/login" });
    };

    return (
        <>
            <nav className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white p-4">
                <Label.Root innerText="Development" bgColor="red" />

                <div className="flex items-center">
                    {/* Bell Dropdown */}
                    <div className="relative inline-block text-left">
                        {/* <button
                        className="rounded-lg p-3 hover:cursor-pointer hover:bg-slate-200"
                        onClick={() => setShowNotificationDropdown((show) => !show)}
                        type="button"
                    >
                        <BellIcon size={18} />
                    </button> */}
{/* 
                        {showNotificationDropdown && (
                            <div className="absolute right-0 z-10 mt-1 w-80 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden">
                                <div>
                                    <p className="px-4 py-2 text-sm font-bold">Notifications</p>
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
                        )} */}
                    </div>

                    {/* User Dropdown*/}
                    <div
                        className="relative inline-block rounded-lg px-4 py-1.5 text-left hover:cursor-pointer hover:bg-slate-200"
                        onClick={() => setShowUserDropdown((show) => !show)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-orange-200"></div>
                            <div className="flex flex-col">
                                <p className="-mb-1 text-sm font-semibold">{user?.email}</p>
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
                                        to={"/account/profile" as any}
                                    >
                                        Profile
                                    </Link>

                                    <Link
                                        className="block truncate px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                                        to={"/account/settings" as any}
                                    >
                                        Settings
                                    </Link>
                                    <hr className="border-gray-100 px-2" />
                                    <button
                                        className="block w-full truncate px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}