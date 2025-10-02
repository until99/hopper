import React from 'react';

interface SelectIconProps {
    className?: string;
}

export const SelectIcon: React.FC<SelectIconProps> = ({
    className = ""
}) => {
    return (
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 ${className}`}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );
};
