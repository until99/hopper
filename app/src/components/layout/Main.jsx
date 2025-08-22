import { CpuIcon, ShieldIcon } from "@phosphor-icons/react";
import { Header } from "./Header";
import { menu_items } from "../../utils/variables/mockData";
import { Link } from "@tanstack/react-router";
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
function Main({ children }) {
  return (
    <div className="scrollbar-thumb-sky-700 scrollbar-track-sky-300 flex bg-slate-50">
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
        <Header />
        {children}
      </main>
    </div>
  );
}

export { Main };
