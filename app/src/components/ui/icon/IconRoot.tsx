import { createContext, useContext, type ReactNode } from "react";
import { type Icon } from "@phosphor-icons/react";

interface IconContextValue {
  Icon: Icon;
  size: number;
  bgColor: "transparent" | "blue" | "red" | "green" | "purple" | "yellow" | "gray" | "slate";
  fontColor: "white" | "black" | "blue" | "red" | "green" | "purple" | "yellow" | "gray" | "slate";
  weight: "light" | "regular" | "bold" | "fill";
  colorMap: Record<string, string>;
}

interface IconRootProps {
  children: ReactNode;
  icon: Icon;
  size: number;
  bgColor?: "transparent" | "blue" | "red" | "green" | "purple" | "yellow" | "gray" | "slate";
  fontColor?: "white" | "black" | "blue" | "red" | "green" | "purple" | "yellow" | "gray" | "slate";
  weight?: "light" | "regular" | "bold" | "fill";
  hasHover?: boolean;
  bgHoverColor?: "blue" | "red" | "green" | "purple" | "yellow" | "gray" | "slate";
  hoverFontColor?: "white" | "black" | "blue" | "red" | "green" | "purple" | "yellow" | "gray" | "slate";
  hoverEffect?: boolean;
  hoverScale?: boolean;
  hoverTranslate?: boolean;
}

const IconContext = createContext<IconContextValue | null>(null);

export const useIconContext = () => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error("useIconContext must be used within an IconRoot");
  }
  return context;
};

export const IconRoot = ({
  children,
  icon,
  size,
  bgColor = "gray",
  fontColor = "white",
  weight = "regular"
}: IconRootProps) => {
  const colorMap = {
    transparent: "bg-transparent hover:bg-gray-100",
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    gray: "bg-gray-500 hover:bg-gray-600",
    slate: "bg-slate-500 hover:bg-slate-600",
  };

  const contextValue: IconContextValue = {
    Icon: icon,
    size,
    bgColor,
    fontColor,
    weight,
    colorMap,
  };

  return (
    <IconContext.Provider value={contextValue}>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </IconContext.Provider>
  );
};
