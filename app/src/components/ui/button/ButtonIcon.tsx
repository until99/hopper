import type { Icon } from "@phosphor-icons/react";

interface ButtonIconProps {
    IconComponent: Icon;
    size: number;
    className?: string;
}

export const ButtonIcon = ({ IconComponent, size, className }: ButtonIconProps) => {
    return (
        <span className={`${className}`}>
            {IconComponent && <IconComponent size={size} />}
        </span>
    );
};
