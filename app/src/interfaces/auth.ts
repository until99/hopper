export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;

  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;

  signOut: () => Promise<{ error: AuthError | null }>;
}
