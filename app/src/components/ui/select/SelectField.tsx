import React from 'react';

interface SelectFieldProps {
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    value,
    onChange,
    className = "",
    children,
    disabled = false
}) => {
    return (
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`appearance-none rounded-md border border-gray-300 bg-white px-3 text-gray-600 py-1 pr-8 text-sm  focus:outline-none focus:ring-1  ${className}`}
        >
            {children}
        </select>
    );
};
