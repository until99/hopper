import { type ReactNode } from 'react';

interface TableHeaderCellProps {
  children: ReactNode;
  onClick?: () => void;
  sortable?: boolean;
  className?: string;
}

export const TableHeaderCell = ({ 
  children, 
  onClick, 
  sortable = false, 
  className = '' 
}: TableHeaderCellProps) => {
  return (
    <th 
      className={`p-3 text-left text-sm font-medium text-slate-500 ${
        sortable || onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {children}
      </div>
    </th>
  );
};
