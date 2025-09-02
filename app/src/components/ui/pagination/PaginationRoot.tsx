import React from 'react';
import { Select } from '../select';

interface PaginationRootProps {
  children: React.ReactNode;
  className?: string;
  showInfo?: boolean;
  startRow?: number;
  endRow?: number;
  totalRows?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

export const PaginationRoot: React.FC<PaginationRootProps> = ({
  children,
  className = "",
  showInfo = false,
  startRow,
  endRow,
  totalRows,
  pageSize,
  onPageSizeChange
}) => {
  return (
    <div className={`flex items-center justify-between bg-white ${className}`}>
      <>
        {showInfo && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{startRow}</span>{' '}
              to{' '}
              <span className="font-medium">{endRow}</span>{' '}
              of{' '}
              <span className="font-medium">{totalRows}</span> results
            </p>
            {onPageSizeChange && (
              <Select.Root className="ml-2">
                <Select.Field
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                  {[5, 10, 20, 30, 50].map(size => (
                    <Select.Option key={size} value={size}>
                      Show {size}
                    </Select.Option>
                  ))}
                </Select.Field>
                <Select.Icon />
              </Select.Root>
            )}
          </div>
        )}
        <nav className="isolate inline-flex -space-x-px rounded-md" aria-label="pagination">
          {children}
        </nav>
      </>
    </div>
  );
};
