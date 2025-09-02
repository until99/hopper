import { type ReactNode } from 'react';

interface TableRootProps {
    children: ReactNode;
    className?: string;
}

export const TableRoot = ({ children, className = '' }: TableRootProps) => {
    return (
        <div className={`overflow-hidden rounded-lg border border-slate-200 bg-white ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    {children}
                </table>
            </div>
        </div>
    );
};
