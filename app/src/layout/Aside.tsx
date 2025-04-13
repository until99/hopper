import AsideListItem from "../components/AsideListItem";
import Brand from "../components/Brand";

export default function Aside() {
  return (
    <aside className="bg-slate-800 text-white transition-all duration-300 z-20 w-64">
      <Brand />
      <nav className="p-2">
        <ul className="space-y-1">
          <AsideListItem isActive={true} />
          <AsideListItem isActive={false} />
          <AsideListItem isActive={false} />
          <AsideListItem isActive={false} />
          <AsideListItem isActive={false} />
        </ul>
      </nav>
    </aside>
  );
};