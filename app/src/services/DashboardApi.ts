import { authApiService } from './AuthApi';

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

export const dashboardApi = {
  async getAllDashboardsWithCategories(): Promise<any[]> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/dashboards/`);
  },

  async assignCategoryToDashboard(dashboardId: string, categoryId: string): Promise<{ message: string }> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/dashboards/assign-category`, {
      method: 'POST',
      body: JSON.stringify({
        dashboard_id: dashboardId,
        category_id: categoryId,
      }),
    });
  },

  async getDashboardCategory(dashboardId: string): Promise<{ dashboard_id: string; category: any | null }> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/dashboards/${dashboardId}/category`);
  },

  async removeCategoryFromDashboard(dashboardId: string): Promise<{ message: string }> {
    return authenticatedFetch(`${API_BASE_URL}/api/v1/dashboards/${dashboardId}/category`, {
      method: 'DELETE',
    });
  },
};
