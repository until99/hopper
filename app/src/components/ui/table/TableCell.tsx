import { type ReactNode } from 'react';

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export const TableCell = ({ children, className = '', colSpan }: TableCellProps) => {
  return (
    <td className={`p-3 text-sm text-black ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
};
