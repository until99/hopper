import type { Icon } from "@phosphor-icons/react";

interface IconButtonProps {
    size: number;
    bgColor: "blue" | "red" | "green" | "purple" | "yellow" | "gray" | "slate";
    icon: Icon;
}

const colorMap = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-500",
    slate: "bg-slate-500",
};

export const IconButton = ({ size, bgColor, icon: Icon }: IconButtonProps) => {
    return (
        <button className={`rounded-lg p-3 ${colorMap[bgColor]}`}>
            <Icon size={size} className="text-white" />
        </button>
    );
};
