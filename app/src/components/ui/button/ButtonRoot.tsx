interface ButtonRootProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    bgColor?: string;
    textColor?: string;
    hover?: boolean;
    hoverColor?: string;
}

export const ButtonRoot = ({ children, onClick, className, bgColor, textColor, hover, hoverColor }: ButtonRootProps) => {
    return (
        <button
            className={`flex py-2 px-3 h-10 rounded cursor-pointer text-sm items-center gap-2 ${bgColor} ${textColor} ${hover ? `hover:${hoverColor}` : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
