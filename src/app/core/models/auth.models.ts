export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthState {
  userId: string | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}
