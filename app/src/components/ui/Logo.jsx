import { CpuIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";

const Logo = ({ size = "md", showText = true, className }) => {
  const sizes = {
    sm: {
      icon: 24,
      text: "text-lg",
    },
    md: {
      icon: 48,
      text: "text-2xl",
    },
    lg: {
      icon: 64,
      text: "text-3xl",
    },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <CpuIcon
        size={currentSize.icon}
        className="rounded-lg bg-blue-500 p-3 text-white"
      />
      {showText && (
        <span className={cn("font-bold text-slate-900", currentSize.text)}>
          Hopper
        </span>
      )}
    </div>
  );
};

export default Logo;
