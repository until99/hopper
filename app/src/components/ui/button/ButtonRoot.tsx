interface ButtonRootProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    bgColor?: string;
    textColor?: string;
    hover?: boolean;
    hoverColor?: string;
    disabled?: boolean;
}

export const ButtonRoot = ({ children, onClick, className, bgColor, textColor, hover, hoverColor, disabled }: ButtonRootProps) => {
    return (
        <button
            className={`flex py-2 px-3 h-10 rounded text-sm items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${bgColor} ${textColor} ${hover && !disabled ? `hover:${hoverColor}` : ''} ${className}`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
