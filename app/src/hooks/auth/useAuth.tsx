import React, { useState, useEffect, createContext, useCallback, useContext } from "react";
import { supabase } from "../../lib/supabaseClient";
import { authApiService, type User as ApiUser } from "../../services/AuthApi";
import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  user: User | ApiUser | null;
  loading: boolean;
  useSupabaseAuth: boolean;
  toggleAuthMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [useSupabaseAuth, setUseSupabaseAuth] = useState(true); // Por padrão usa Supabase
  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      if (useSupabaseAuth) {
        // Inicialização com Supabase
        const getSession = async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          setUser(session?.user ?? null);
          setLoading(false);
        };

        getSession();

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });

        return () => subscription.unsubscribe();
      } else {
        // Inicialização com API própria
        try {
          if (authApiService.isAuthenticated()) {
            const currentUser = await authApiService.getCurrentUser();
            setUser(currentUser);
          }
        } catch (error) {
          console.error('Erro ao verificar usuário atual:', error);
          localStorage.removeItem('auth_token');
        } finally {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, [useSupabaseAuth]);

  const login = useCallback(async (email: string, password: string) => {
    if (useSupabaseAuth) {
      // Login com Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } else {
      // Login com API própria
      try {
        const response = await authApiService.login({ email, password });
        setUser(response.user);
        return { error: null };
      } catch (error) {
        return { error: { message: (error as Error).message } };
      }
    }
  }, [useSupabaseAuth]);

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    if (useSupabaseAuth) {
      // Registro com Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      return { error };
    } else {
      // Registro com API própria
      try {
        const response = await authApiService.register({ 
          email, 
          password, 
          full_name: fullName 
        });
        setUser(response.user);
        return { error: null };
      } catch (error) {
        return { error: { message: (error as Error).message } };
      }
    }
  }, [useSupabaseAuth]);

  const logout = useCallback(async () => {
    if (useSupabaseAuth) {
      // Logout com Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } else {
      // Logout com API própria
      try {
        await authApiService.logout();
      } catch (error) {
        console.error('Error signing out:', error);
      } finally {
        setUser(null);
      }
    }
  }, [useSupabaseAuth]);

  const toggleAuthMode = useCallback(() => {
    // Fazer logout antes de trocar o modo
    logout();
    setUseSupabaseAuth(!useSupabaseAuth);
  }, [useSupabaseAuth, logout]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      useSupabaseAuth, 
      toggleAuthMode 
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
