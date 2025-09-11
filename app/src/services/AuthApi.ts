interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at?: string;
}

interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface AuthResponse {
  user: User;
  session: Token;
}

class AuthApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api/v1/auth${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adiciona o token de autorização se estiver disponível
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      // Se for erro 401 ou 403, significa que o token expirou
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('auth_token');
        throw new Error('Token expirado ou inválido');
      }
      
      const error = await response.json().catch(() => ({ 
        detail: 'Erro desconhecido' 
      }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Salva o token no localStorage
    localStorage.setItem('auth_token', response.session.access_token);
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Salva o token no localStorage
    localStorage.setItem('auth_token', response.session.access_token);
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/logout', {
        method: 'POST',
      });
    } finally {
      // Remove o token independentemente do resultado da requisição
      localStorage.removeItem('auth_token');
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/me');
  }

  async verifyToken(): Promise<{ valid: boolean; user_id: string }> {
    return this.request<{ valid: boolean; user_id: string }>('/verify');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authApiService = new AuthApiService();
export type { LoginRequest, RegisterRequest, User, Token, AuthResponse };