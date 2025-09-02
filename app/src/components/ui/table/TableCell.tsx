import { type ReactNode } from 'react';

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export const TableCell = ({ children, className = '' }: TableCellProps) => {
  return (
    <td className={`p-3 text-sm text-black ${className}`}>
      {children}
    </td>
  );
};
