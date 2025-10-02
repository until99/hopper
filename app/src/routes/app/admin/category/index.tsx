import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, type FilterFn, useReactTable } from '@tanstack/react-table';
import { ArrowsClockwiseIcon, CaretDoubleLeftIcon, CaretDoubleRightIcon, CaretLeftIcon, CaretRightIcon, CheckCircleIcon, MagnifyingGlassIcon, PlusIcon, SpinnerIcon, TagIcon } from '@phosphor-icons/react';

import { Table } from '../../../../components/ui/table';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/button';
import { Header } from '../../../../components/layout/header';
import { Main } from '../../../../components/layout/main/index';
import { Pagination } from '../../../../components/ui/pagination';
import { Cell } from '../../../../components/ui/cells';
import { useCategories } from '../../../../hooks/useCategories';
import type { Category, CategoryCreate } from '../../../../interfaces/category';
import { CategoryModal } from '../../../../components/admin/category/CategoryModal';

export const Route = createFileRoute('/app/admin/category/')({
    component: RouteComponent,
});

const initialPageSize = 10;

const columnHelper = createColumnHelper<Category>();

const globalFilterFn: FilterFn<Category> = (row, _columnId, value) => {
    const search = value.toLowerCase();
    return (
        row.original.name.toLowerCase().includes(search) ||
        (row.original.description && row.original.description.toLowerCase().includes(search)) ||
        row.original.color.toLowerCase().includes(search)
    );
};

function RouteComponent() {
    const [globalFilter, setGlobalFilter] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { categories, loading, creating, updating, deleting, error, createCategory, updateCategory, deleteCategory, refetch } = useCategories();

    const showToast = (message: string) => {
        setToastMessage(message);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleCreateCategory = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (category: Category) => {
        if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
            try {
                await deleteCategory(category.id);
                showToast('Category deleted successfully!');
            } catch (err) {
                console.error('Error deleting category:', err);
            }
        }
    };

    const handleRefresh = async () => {
        try {
            await refetch();
            showToast('Categories updated successfully!');
        } catch (err) {
            console.error('Error refreshing categories:', err);
        }
    };

    const columns = [
        columnHelper.accessor('name', {
            id: 'name',
            header: 'Name',
            cell: ({ getValue, row }) => (
                <Cell
                    type="text"
                    value={getValue()}
                    icon={<TagIcon size={16} weight="regular" className="text-slate-500" />}
                    style={{
                        fontWeight: 'medium',
                        textColor: 'text-gray-900'
                    }}
                />
            ),
        }),
        columnHelper.accessor('color', {
            id: 'color',
            header: 'Color',
            cell: ({ getValue }) => (
                <Cell
                    type="badge"
                    value={getValue()}
                    badgeConfig={{
                        color: getValue()
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
                    value={getValue() || 'No description'}
                    style={{
                        textColor: getValue() ? 'text-gray-600' : 'text-gray-400',
                        className: 'max-w-xs truncate'
                    }}
                />
            ),
        }),
        columnHelper.accessor('dashboard_count', {
            id: 'dashboard_count',
            header: 'Dashboards',
            cell: ({ getValue }) => (
                <Cell
                    type="badge"
                    value={getValue().toString()}
                    badgeConfig={{
                        color: 'slate'
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
                        onEdit: handleEditCategory,
                        onDelete: handleDeleteCategory
                    }}
                />
            ),
        }),
    ];

    const table = useReactTable({
        data: categories,
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
                pageSize: initialPageSize,
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
                        title="Categories"
                        subtitle="Manage dashboard categories"
                    />
                    <div className="flex gap-3">
                        <Button.Root
                            bgColor='bg-green-600'
                            hover
                            hoverColor='bg-green-700'
                            textColor='text-white'
                            onClick={handleCreateCategory}
                            className='font-medium'
                        >
                            <PlusIcon
                                size={16}
                                weight='bold'
                            />
                            New Category
                        </Button.Root>
                        <Button.Root
                            bgColor='bg-blue-600'
                            hover
                            hoverColor='bg-blue-700'
                            textColor='text-white'
                            onClick={handleRefresh}
                            className='font-medium'
                            disabled={loading}
                        >
                            {loading ? (
                                <SpinnerIcon
                                    size={16}
                                    weight='bold'
                                    className="animate-spin"
                                />
                            ) : (
                                <ArrowsClockwiseIcon
                                    size={16}
                                    weight='bold'
                                />
                            )}
                            {loading ? 'Loading...' : 'Refresh'}
                        </Button.Root>
                    </div>
                </div>

                <div className="mt-6">
                    <Input.Root>
                        <Input.Field
                            id="search"
                            placeholder="Search categories..."
                            type='text'
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            icon={<MagnifyingGlassIcon size={16} weight='bold' />}
                        />
                    </Input.Root>
                </div>

                {/* Table */}
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
                            {loading || creating || updating || deleting ? (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <div className="flex justify-center items-center py-8">
                                            <div className="flex items-center gap-2">
                                                <SpinnerIcon
                                                    size={20}
                                                    weight='bold'
                                                    className="animate-spin text-blue-600"
                                                />
                                                <span className="text-gray-600">
                                                    {loading
                                                        ? 'Loading categories...'
                                                        : creating
                                                            ? 'Creating category...'
                                                            : updating
                                                                ? 'Updating category...'
                                                                : 'Deleting category...'
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ) : error ? (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <div className="flex justify-center items-center py-8">
                                            <div className="text-red-600">Erro: {error}</div>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <div className="flex justify-center items-center py-8">
                                            <div className="text-gray-500">No categories found</div>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <Table.Row key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <Table.Cell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>

                    {/* Pagination */}
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

                {/* Success Toast */}
                {showSuccessToast && (
                    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg">
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="text-sm">{toastMessage}</span>
                        </div>
                    </div>
                )}

                {/* Category Modal */}
                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    category={editingCategory}
                    onSave={async (categoryData) => {
                        try {
                            if (editingCategory) {
                                await updateCategory(editingCategory.id, categoryData);
                                showToast('Category updated successfully!');
                            } else {
                                await createCategory(categoryData as CategoryCreate);
                                showToast('Category created successfully!');
                            }
                            setIsModalOpen(false);
                        } catch (err) {
                            console.error('Error saving category:', err);
                        }
                    }}
                />

            </Main.Body>
        </Main.Root>
    );
}
