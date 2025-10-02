import { useIconContext } from './IconRoot';

interface IconButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    padding?: number;
    hoverEffect?: boolean;
    hoverScale?: boolean;
    hoverTranslate?: boolean;
}

export const IconButton = ({
    onClick,
    disabled = false,
    className = "",
    type = "button",
    padding = 2,
    hoverEffect = true,
    hoverScale = false,
    hoverTranslate = false
}: IconButtonProps) => {
    const { size, bgColor, fontColor, weight, colorMap, Icon } = useIconContext();

    const hoverClasses = [
        hoverEffect ? "hover:opacity-80" : "",
        hoverScale ? "hover:scale-105" : "",
        hoverTranslate ? "hover:translate-y-[-1px]" : ""
    ].filter(Boolean).join(" ");

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                rounded-lg 
                ${padding ? `p-${padding}` : "p-2"}
                ${colorMap[bgColor]} 
                transition-all duration-200 
                ${hoverClasses}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${className}
            `.replace(/\s+/g, ' ').trim()}
        >
            <Icon size={size} className={`text-${fontColor}`} weight={weight} />
        </button>
    );
};
