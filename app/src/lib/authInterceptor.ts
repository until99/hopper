import { authApiService } from '../services/AuthApi';

// Interceptor para adicionar token de autorização automaticamente e gerenciar expiração
const originalFetch = window.fetch;

// Callback para quando o token expira
let onTokenExpiredCallback: (() => void) | null = null;

export const setTokenExpiredCallback = (callback: () => void) => {
  onTokenExpiredCallback = callback;
};

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
  
  const response = await originalFetch(input, init);
  
  // Verifica se a resposta é 401 (não autorizado) ou 403 (token expirado)
  if ((response.status === 401 || response.status === 403) && 
      url.startsWith(apiUrl) && 
      !url.includes('/auth/login') && 
      !url.includes('/auth/register')) {
    
    console.log('Token expirado detectado via resposta HTTP');
    
    // Remove o token do localStorage
    localStorage.removeItem('auth_token');
    
    // Chama o callback se estiver definido
    if (onTokenExpiredCallback) {
      onTokenExpiredCallback();
    }
  }
  
  return response;
};

export {};
