export const USER_ROLES = {
  admin: 'Admin Principal',
  enterprise: 'Entreprise',
  restaurant: 'Restaurant',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthState {
  userId: string | null;
  token: string | null;
  role: UserRole | null;
  profile: AdminProfile | null;
  isAuthenticated: boolean;
}
