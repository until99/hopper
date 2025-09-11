import { useState, useEffect } from 'react';
import { categoryApi } from '../services/CategoryApi';
import type { Category, CategoryCreate, CategoryUpdate } from '../interfaces/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryApi.getAllCategories();
      setCategories(response.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CategoryCreate): Promise<Category> => {
    try {
      setCreating(true);
      setError(null);
      
      const newCategory = await categoryApi.createCategory(categoryData);
      
      // Atualiza a lista local
      setCategories(prev => [...prev, newCategory]);
      
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      console.error('Error creating category:', err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const updateCategory = async (categoryId: string, categoryData: CategoryUpdate): Promise<Category> => {
    try {
      setUpdating(true);
      setError(null);
      
      const updatedCategory = await categoryApi.updateCategory(categoryId, categoryData);
      
      // Atualiza a lista local
      setCategories(prev => 
        prev.map(cat => cat.id === categoryId ? updatedCategory : cat)
      );
      
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const deleteCategory = async (categoryId: string): Promise<void> => {
    try {
      setDeleting(true);
      setError(null);
      
      await categoryApi.deleteCategory(categoryId);
      
      // Remove da lista local
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  const refetch = () => fetchCategories();

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    creating,
    updating,
    deleting,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch,
  };
};
