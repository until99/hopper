import { Cpu, ChartLine } from "@phosphor-icons/react";

function Home() {
  return (
    <main>
      <aside className="h-screen w-64 border-r bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-700 bg-slate-900 p-6">
          <Cpu size={32} className="rounded-lg bg-blue-500 p-2 text-white" />
          <h1 className="text-2xl font-bold text-white">Hopper</h1>
        </div>
        <ul>
          <li className="flex border-b border-slate-700 p-4 font-semibold text-white">
            <ChartLine size={22} className="mr-2 inline-block" />
            <p>Dashboard</p>
          </li>
          <li className="flex border-b border-slate-700 p-4 font-semibold text-white">
            <ChartLine size={22} className="mr-2 inline-block" />
            <p>Settings</p>
          </li>
          <li className="flex border-b border-slate-700 p-4 font-semibold text-white">
            <ChartLine size={22} className="mr-2 inline-block" />
            <p>Profile</p>
          </li>
        </ul>
      </aside>
      <section></section>
    </main>
  );
}

export default Home;
