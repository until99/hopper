import type { ElementType } from "react";

interface InputIconProps {
  icon?: ElementType;
}

export const InputIcon = ({ icon }: InputIconProps) => {
  const Icon = icon;
  return (
    <span className="text-slate-400 pl-3">
      <Icon />
    </span>
  );
};
