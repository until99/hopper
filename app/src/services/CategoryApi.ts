import { authApiService } from './AuthApi';
import type { Category, CategoryCreate, CategoryUpdate, CategoryListResponse } from '../interfaces/category';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hopper-glyb.onrender.com';

async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = authApiService.getToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const categoryApi = {
  async createCategory(category: CategoryCreate): Promise<Category> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/categories/`, {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async getAllCategories(): Promise<CategoryListResponse> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/categories/`);
  },

  async getCategoryById(categoryId: string): Promise<Category> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/categories/${categoryId}`);
  },

  async updateCategory(categoryId: string, category: CategoryUpdate): Promise<Category> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },
};
