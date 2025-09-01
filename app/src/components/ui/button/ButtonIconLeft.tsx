interface ButtonIconLeftProps {
    icon: React.ReactNode;
    className?: string;
}

export const ButtonIconLeft = ({ icon, className }: ButtonIconLeftProps) => {
    return (
        <span className={`ml-2 ${className}`}>
            {icon}
        </span>
    );
};
