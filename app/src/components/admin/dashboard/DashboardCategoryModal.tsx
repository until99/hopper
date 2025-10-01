import { useState, useEffect } from 'react';
import { XIcon, TagIcon, PlusIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/Input';
import { useCategories } from '../../../hooks/useCategories';
import { CategoryModal } from '../category/CategoryModal';
import type { Dashboard } from '../../../interfaces/dashboard';

interface DashboardCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    dashboard: Dashboard | null;
    onAssignCategory: (dashboardId: string, categoryId: string) => Promise<void>;
}

export function DashboardCategoryModal({ isOpen, onClose, dashboard, onAssignCategory }: DashboardCategoryModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [assigning, setAssigning] = useState(false);

    const { categories, loading, createCategory } = useCategories();

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCreateAndAssign = async (categoryData: any) => {
        try {
            const newCategory = await createCategory(categoryData);
            setShowCreateModal(false);

            if (dashboard) {
                await handleAssignCategory(newCategory.id);
            }
        } catch (error) {
            console.error('Error creating and assigning category:', error);
        }
    };

    const handleAssignCategory = async (categoryId: string) => {
        if (!dashboard) return;

        setAssigning(true);
        try {
            await onAssignCategory(dashboard.dashboardId, categoryId);
            onClose();
        } catch (error) {
            console.error('Error assigning category:', error);
        } finally {
            setAssigning(false);
        }
    };

    const handleClose = () => {
        if (!assigning) {
            onClose();
        }
    };

    if (!isOpen || !dashboard) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-xl w-[60vh] mx-4 h-[80vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Atribuir Categoria
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Dashboard: {dashboard.title}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={assigning}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 cursor-pointer"
                        >
                            <XIcon size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Search */}
                        <div className="mb-4">
                            <Input.Root>
                                <Input.Field
                                    id="category-search"
                                    type="text"
                                    placeholder="Buscar categorias..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    icon={<MagnifyingGlassIcon size={16} weight="bold" />}
                                />
                            </Input.Root>
                        </div>

                        {/* Create New Category Button */}
                        <div className="mb-4">
                            <Button.Root
                                onClick={() => setShowCreateModal(true)}
                                bgColor="bg-green-100"
                                textColor="text-green-700"
                                hover
                                hoverColor="bg-green-200"
                                className="w-full justify-center font-medium"
                                disabled={assigning}
                            >
                                <PlusIcon size={16} weight="bold" />
                                Criar Nova Categoria
                            </Button.Root>
                        </div>

                        {/* Categories List */}
                        <div className="space-y-2 pb-2 h-[45vh] overflow-y-auto">
                            {loading ? (
                                <div className="text-center py-4 text-gray-500">
                                    Carregando categorias...
                                </div>
                            ) : filteredCategories.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria disponível'}
                                </div>
                            ) : (
                                filteredCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleAssignCategory(category.id)}
                                        disabled={assigning}
                                        className={`
                      w-full p-3 rounded-lg border-slate-200 border text-left transition-all
                      hover:border-blue-300 hover:bg-blue-50
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${assigning ? 'opacity-50' : ''}
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${getCategoryColorClass(category.color)}`} />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{category.name}</div>
                                                {category.description && (
                                                    <div className="text-sm text-gray-500 mt-1">{category.description}</div>
                                                )}
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {category.dashboard_count} dashboard(s)
                                                </div>
                                            </div>
                                            <TagIcon size={16} className="text-gray-400" />
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Button.Root
                            onClick={handleClose}
                            disabled={assigning}
                            bgColor="bg-gray-100"
                            textColor="text-gray-700"
                            hover
                            hoverColor="bg-gray-200"
                            className="w-full justify-center"
                        >
                            {assigning ? 'Atribuindo...' : 'Cancelar'}
                        </Button.Root>
                    </div>
                </div>
            </div>

            {/* Create Category Modal */}
            <CategoryModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSave={handleCreateAndAssign}
            />
        </>
    );
}

function getCategoryColorClass(color: string): string {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        emerald: 'bg-emerald-500',
        violet: 'bg-violet-500',
        yellow: 'bg-yellow-500',
        slate: 'bg-slate-500',
    };
    return colorClasses[color as keyof typeof colorClasses] || 'bg-gray-500';
}
