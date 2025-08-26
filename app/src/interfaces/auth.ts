import type { User, AuthError } from "@supabase/supabase-js";

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
