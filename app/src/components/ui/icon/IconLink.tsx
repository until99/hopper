import { useIconContext } from './IconRoot';

interface IconLinkProps {
    href?: string;
    className?: string;
}

export const IconLink = ({ href = "#", className = "" }: IconLinkProps) => {
    const { size, bgColor, colorMap, Icon } = useIconContext();

    return (
        <a href={href} className={`rounded-lg p-3 ${colorMap[bgColor]} ${className}`}>
            <Icon size={size} className="text-white" />
        </a>
    );
}