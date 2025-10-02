import { type ReactNode } from 'react';

interface TableHeaderProps {
  children: ReactNode;
}

export const TableHeader = ({ children }: TableHeaderProps) => {
  return (
    <thead>
      <tr className="border-b border-slate-200 bg-slate-50">
        {children}
      </tr>
    </thead>
  );
};
