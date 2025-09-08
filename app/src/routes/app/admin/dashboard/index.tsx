import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, type FilterFn, useReactTable } from '@tanstack/react-table';
import { CaretDoubleLeftIcon, CaretDoubleRightIcon, CaretLeftIcon, CaretRightIcon, CheckCircleIcon, MagnifyingGlassIcon, UploadIcon } from '@phosphor-icons/react';

import { Table } from '../../../../components/ui/table';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/button';
import { Header } from '../../../../components/layout/header';
import { Main } from '../../../../components/layout/main/index';
import { Pagination } from '../../../../components/ui/pagination';
import { type Dashboard } from '../../../../interfaces/dashboard';

import { Cell } from '../../../../components/ui/cells';

export const Route = createFileRoute('/app/admin/dashboard/')({
  component: RouteComponent,
});

const mockDashboards: Dashboard[] = [
  {
    id: '1',
    title: 'Sales Dashboard',
    description: 'Comprehensive sales analytics and performance metrics',
    workspace: 'Sales',
    category: 'Analytics',
    categoryColor: 'blue',
    dashboardId: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
  },
  {
    id: '2',
    title: 'Marketing ROI',
    description: 'Return on investment analysis for marketing campaigns',
    workspace: 'Marketing',
    category: 'Finance',
    categoryColor: 'green',
    dashboardId: 'def456ghi789jkl012mno345pqr678stu901vwx234yza567bcd',
  },
  {
    id: '3',
    title: 'Customer Insights',
    description: 'Customer behavior and satisfaction analysis',
    workspace: 'Customer Success',
    category: 'Research',
    categoryColor: 'violet',
    dashboardId: 'ghi789jkl012mno345pqr678stu901vwx234yza567bcdef890hij',
  },
];

const columnHelper = createColumnHelper<Dashboard>();

const globalFilterFn: FilterFn<Dashboard> = (row, _columnId, value) => {
  const search = value.toLowerCase();
  return (
    row.original.title.toLowerCase().includes(search) ||
    row.original.description.toLowerCase().includes(search) ||
    row.original.workspace.toLowerCase().includes(search) ||
    row.original.category.toLowerCase().includes(search)
  );
};


function RouteComponent() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleCopyDashboardId = (dashboardId: string) => {
    navigator.clipboard.writeText(dashboardId);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleEditDashboard = (dashboard: Dashboard) => {
    console.log('Edit dashboard:', dashboard);
    // Implementar lógica de edição
  };

  const handleDeleteDashboard = (dashboard: Dashboard) => {
    console.log('Delete dashboard:', dashboard);
    // Implementar lógica de exclusão
  };

  const columns = [
    columnHelper.accessor('title', {
      id: 'title',
      header: 'Title',
      cell: ({ getValue }) => (
        <Cell
          type="text"
          value={getValue()}
          style={{
            fontWeight: 'medium',
            textColor: 'text-gray-900'
          }}
        />
      ),
    }),
    columnHelper.accessor('description', {
      id: 'description',
      header: 'Description',
      cell: ({ getValue }) => (
        <Cell
          type="text"
          value={getValue()}
          style={{
            textColor: 'text-gray-600',
            className: 'max-w-xs truncate'
          }}
        />
      ),
    }),
    columnHelper.accessor('workspace', {
      id: 'workspace',
      header: 'Workspace',
      cell: ({ getValue }) => (
        <Cell
          type="text"
          value={getValue()}
          style={{
            fontWeight: 'medium',
            textColor: 'text-gray-700'
          }}
        />
      ),
    }),
    columnHelper.accessor('category', {
      id: 'category',
      header: 'Category',
      cell: ({ getValue, row }) => (
        <Cell
          type="badge"
          value={getValue()}
          badgeConfig={{
            color: row.original.categoryColor
          }}
        />
      ),
    }),
    columnHelper.accessor('dashboardId', {
      id: 'dashboardId',
      header: 'Dashboard ID',
      cell: ({ getValue }) => (
        <Cell
          type="truncated-copy"
          value={getValue()}
          truncatedCopyConfig={{
            maxLength: 20,
            onCopy: handleCopyDashboardId
          }}
        />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Cell
          type="actions"
          item={row.original}
          actionsConfig={{
            onEdit: handleEditDashboard,
            onDelete: handleDeleteDashboard
          }}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: mockDashboards,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  const maxVisiblePages = 5;
  let startPage = Math.max(0, pageIndex - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pageCount - 1, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <div className="flex justify-between items-center">
          <Header.Root
            title="Dashboards"
            subtitle="Manage published dashboards and upload new ones"
          />
          <Button.Root
            bgColor='bg-blue-600'
            hover
            hoverColor='bg-blue-700'
            textColor='text-white'
            onClick={() => { }}
            className='font-medium'
          >
            <UploadIcon
              size={16}
              weight='bold'
            />
            Upload PBIX
          </Button.Root>
        </div>

        <div className="mt-6">
          <Input.Root>
            <Input.Field
              id="search"
              placeholder="Search dashboards..."
              type='text'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              icon={<MagnifyingGlassIcon size={16} weight='bold' />}
            />
          </Input.Root>
        </div>

        <section className='mt-6'>
          <Table.Root>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <Table.HeaderCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </Table.HeaderCell>
                ))
              )}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <div className="mt-6 block">
            <Pagination.Root
              showInfo
              startRow={startRow}
              endRow={endRow}
              totalRows={totalRows}
              pageSize={pageSize}
              onPageSizeChange={(size) => table.setPageSize(size)}
            >
              <Pagination.Button
                variant="first"
                onClick={() => table.setPageIndex(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First page</span>
                <CaretDoubleLeftIcon className="h-3 w-3" aria-hidden="true" />
              </Pagination.Button>

              <Pagination.Button
                variant="previous"
                onClick={() => table.previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <CaretLeftIcon className="h-3 w-5" aria-hidden="true" />
              </Pagination.Button>

              {/* Page Numbers */}
              {pageNumbers.map((pageNum: number) => (
                <Pagination.Button
                  key={pageNum}
                  variant="page"
                  active={pageNum === pageIndex}
                  onClick={() => table.setPageIndex(pageNum)}
                >
                  {pageNum + 1}
                </Pagination.Button>
              ))}

              <Pagination.Button
                variant="next"
                onClick={() => table.nextPage()}
                disabled={!canNextPage}
              >
                <span className="sr-only">Next</span>
                <CaretRightIcon className="h-3 w-5" aria-hidden="true" />
              </Pagination.Button>

              <Pagination.Button
                variant="last"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last page</span>
                <CaretDoubleRightIcon className="h-3 w-5" aria-hidden="true" />
              </Pagination.Button>
            </Pagination.Root>
          </div>
        </section>

        {/* Toast de Sucesso */}
        {showSuccessToast && (
          <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="text-sm">Dashboard ID copiado com sucesso!</span>
            </div>
          </div>
        )}

      </Main.Body>
    </Main.Root>
  );
}
