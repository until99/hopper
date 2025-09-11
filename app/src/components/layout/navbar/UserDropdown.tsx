import { Link, useRouter } from "@tanstack/react-router"
import { useAuth } from "../../../hooks/auth/useAuth";
import { useSessionTimeRemaining } from "../../../hooks/useSessionTimeRemaining";


export const UserDropdown = () => {

    const { logout } = useAuth();
    const router = useRouter();
    const { timeRemaining, isExpiringSoon, hasValidSession } = useSessionTimeRemaining();

    const handleSignOut = () => {
        logout();
        router.navigate({ to: "/login" });
    };

    return (
        <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden">
            <div>
                {/* Timer de Sessão */}
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">Sessão ativa</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${hasValidSession ? (isExpiringSoon ? 'bg-yellow-400' : 'bg-green-400') : 'bg-red-400'}`}></div>
                            <span className={`text-xs font-mono ${isExpiringSoon ? 'text-yellow-600 font-semibold' : 'text-gray-700'}`}>
                                {timeRemaining}
                            </span>
                        </div>
                    </div>
                    {isExpiringSoon && hasValidSession && (
                        <p className="text-xs text-yellow-600 mt-1">Sessão expirando em breve</p>
                    )}
                </div>

                <Link
                    className="block truncate px-4 py-2 text-sm text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                    to={"/app/profile" as any}
                >
                    Profile
                </Link>

                <Link
                    className="block truncate px-4 py-2 text-sm text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                    to={"/app/profile/settings" as any}
                >
                    Settings
                </Link>
                <hr className="border-gray-100 px-2" />
                <button
                    className="w-full truncate px-4 py-2 text-sm text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                    onClick={handleSignOut}
                >
                    Sign Out
                </button>
            </div>
        </div>
    )
}