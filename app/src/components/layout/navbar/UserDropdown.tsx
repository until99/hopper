import { Link, useRouter } from "@tanstack/react-router"
import { useAuth } from "../../../hooks/auth/useAuth";


export const UserDropdown = () => {

    const { user, logout } = useAuth();
    const router = useRouter();

    const handleSignOut = () => {
        logout();
        router.navigate({ to: "/login" });
    };

    return (
        <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden">
            <div>
                <p className="px-4 py-2 text-sm font-bold">Profile</p>
                <hr className="border-gray-100 px-2" />

                <Link
                    className="block truncate px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                    to={"/app/profile" as any}
                >
                    Profile
                </Link>

                <Link
                    className="block truncate px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                    to={"/app/profile/settings" as any}
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
    )
}