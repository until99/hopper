import React from 'react';

interface SelectRootProps {
    children: React.ReactNode;
    className?: string;
}

export const SelectRoot: React.FC<SelectRootProps> = ({
    children,
    className = ""
}) => {
    return (
        <div className={`relative ${className}`}>
            {children}
        </div>
    );
};
