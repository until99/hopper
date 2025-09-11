import React, { useState, useEffect, createContext, useCallback, useContext } from "react";
import { authApiService, type User as ApiUser } from "../../services/AuthApi";
import { useSessionTimer } from "../useSessionTimer";
import { setTokenExpiredCallback } from "../../lib/authInterceptor";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  user: ApiUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  const handleSessionExpired = useCallback(async () => {
    console.log('Sessão expirada, fazendo logout automático...');
    setUser(null);
    localStorage.removeItem('auth_token');
  }, []);

  const { startTimer, stopTimer } = useSessionTimer({
    onSessionExpired: handleSessionExpired,
    checkInterval: 30000 // Verifica a cada 30 segundos
  });

  useEffect(() => {
    // Configura o callback do interceptador
    setTokenExpiredCallback(handleSessionExpired);
    
    const initAuth = async () => {
      try {
        // Verifica se há token salvo e tenta obter o usuário atual
        if (authApiService.isAuthenticated()) {
          const currentUser = await authApiService.getCurrentUser();
          setUser(currentUser);
          startTimer(); // Inicia o timer quando o usuário está autenticado
        }
      } catch (error) {
        console.error('Erro ao verificar usuário atual:', error);
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [handleSessionExpired, startTimer]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApiService.login({ email, password });
      setUser(response.user);
      startTimer(); // Inicia o timer após login bem-sucedido
      return { error: null };
    } catch (error) {
      return { error: { message: (error as Error).message } };
    }
  }, [startTimer]);

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      const response = await authApiService.register({ 
        email, 
        password, 
        full_name: fullName 
      });
      setUser(response.user);
      startTimer(); // Inicia o timer após registro bem-sucedido
      return { error: null };
    } catch (error) {
      return { error: { message: (error as Error).message } };
    }
  }, [startTimer]);

  const logout = useCallback(async () => {
    try {
      await authApiService.logout();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      stopTimer(); // Para o timer quando faz logout
    }
  }, [stopTimer]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout, 
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
