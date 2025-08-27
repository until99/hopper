import type { Icon } from "@phosphor-icons/react";

interface InputIconProps {
  IconComponent?: Icon;
}

export const InputIcon = ({ IconComponent }: InputIconProps) => {
  return (
    <span className="text-slate-400 pl-3">
      {IconComponent && <IconComponent />}
    </span>
  );
};
