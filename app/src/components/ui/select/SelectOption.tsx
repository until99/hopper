import React from 'react';

interface SelectOptionProps {
    value: string | number;
    children: React.ReactNode;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
    value,
    children
}) => {
    return (
        <option value={value}>
            {children}
        </option>
    );
};
