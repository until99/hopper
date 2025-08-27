import { type Icon } from "@phosphor-icons/react";

interface IconRootProps {
  size: number;
  type: "button" | "link";
  bgColor: "blue" | "red" | "green" | "purple" | "yellow" | "gray" | "slate";
  icon: Icon;
}

export const IconRoot = ({ size, type, bgColor, icon: Icon }: IconRootProps) => {
  const colorMap = {
    blue: "hover:bg-blue-200",
    red: "hover:bg-red-200",
    green: "hover:bg-green-200",
    purple: "hover:bg-purple-200",
    yellow: "hover:bg-yellow-200",
    gray: "hover:bg-gray-200",
    slate: "hover:bg-slate-200",
  };

  return (
    <div className="flex items-center gap-3 ">
      {type === "button" ? (
        <button className={`rounded-lg p-3 ${colorMap[bgColor]}`}>
          <Icon size={size} className="text-white" />
        </button>
      ) : (
        <a href="#" className={`rounded-lg p-3 ${colorMap[bgColor]}`}>
          <Icon size={size} className="text-white" />
        </a>
      )}
    </div>
  );
}
