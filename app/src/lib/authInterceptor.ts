import { authApiService } from '../services/AuthApi';

// Interceptor para adicionar token de autorização automaticamente e gerenciar expiração
const originalFetch = window.fetch;

// Callback para quando o token expira
let onTokenExpiredCallback: (() => void) | null = null;
let isHandlingExpiration = false; // Flag para evitar múltiplas chamadas

export const setTokenExpiredCallback = (callback: () => void) => {
  onTokenExpiredCallback = callback;
};

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // Verifica se é uma requisição para a API
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const apiUrl = import.meta.env.VITE_API_URL || 'https://hopper-glyb.onrender.com';
  
  // Inclui tanto rotas de auth quanto powerbi na verificação
  const isApiCall = url.startsWith(apiUrl);
  const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');
  const isPowerBICall = url.includes('/powerbi/');
  
  if (isApiCall && !isAuthCall) {
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
  
  // Verifica se a resposta é 401 (não autorizado) - sempre trata como token expirado
  // Para 403 em PowerBI, só trata como token expirado se a resposta indicar problema de autenticação
  if (response.status === 401 && 
      isApiCall && 
      !isAuthCall &&
      !isHandlingExpiration) {
    
    console.log('Token expirado detectado via resposta HTTP 401');
    
    // Evita múltiplas chamadas simultâneas
    isHandlingExpiration = true;
    
    // Remove o token do localStorage
    localStorage.removeItem('auth_token');
    
    // Chama o callback se estiver definido
    if (onTokenExpiredCallback) {
      onTokenExpiredCallback();
    }
    
    // Reset da flag após um pequeno delay
    setTimeout(() => {
      isHandlingExpiration = false;
    }, 1000);
  }
  // Para 403 em PowerBI, verifica se é realmente um problema de autenticação
  else if (response.status === 403 && 
           isPowerBICall && 
           !isHandlingExpiration) {
    
    try {
      const responseText = await response.clone().text();
      // Se a resposta contém indicadores de problema de autenticação, trata como token expirado
      if (responseText.includes('unauthorized') || 
          responseText.includes('token') || 
          responseText.includes('authentication')) {
        
        console.log('Token expirado detectado via resposta HTTP 403 (PowerBI auth issue)');
        
        isHandlingExpiration = true;
        localStorage.removeItem('auth_token');
        
        if (onTokenExpiredCallback) {
          onTokenExpiredCallback();
        }
        
        setTimeout(() => {
          isHandlingExpiration = false;
        }, 1000);
      } else {
        // 403 do PowerBI por falta de permissões - não é problema de token
        console.log('403 do PowerBI - problema de permissões, não de autenticação');
      }
    } catch (error) {
      console.log('Erro ao verificar resposta 403:', error);
    }
  }
  
  return response;
};

export {};
