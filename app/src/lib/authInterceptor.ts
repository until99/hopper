import { authApiService } from '../services/AuthApi';

// Interceptor para adicionar token de autorização automaticamente
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // Verifica se é uma requisição para a API
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  if (url.startsWith(apiUrl) && !url.includes('/auth/login') && !url.includes('/auth/register')) {
    const token = authApiService.getToken();
    
    if (token) {
      const headers = {
        ...init?.headers,
        'Authorization': `Bearer ${token}`,
      };
      
      init = {
        ...init,
        headers,
      };
    }
  }
  
  return originalFetch(input, init);
};

export {};
