import { type ReactNode } from 'react';

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TableRow = ({ children, onClick, className = '' }: TableRowProps) => {
  return (
    <tr 
      className={`border-t border-slate-200 hover:bg-slate-50 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};
