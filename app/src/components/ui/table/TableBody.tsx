import { type ReactNode } from 'react';

interface TableBodyProps {
  children: ReactNode;
}

export const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody>
      {children}
    </tbody>
  );
};
