import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { AuthState, AdminProfile, LoginForm, UserRole, USER_ROLES } from '../models/auth.models';

const TOKEN_KEY = 'jp_token';
const USER_KEY  = 'jp_user';
const ADMIN_EMAIL = 'admin@jambaarpay.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ENTERPRISE_EMAIL = 'entreprise@jambaarpay.com';
const ENTERPRISE_PASSWORD = 'Entreprise@1234';
const RESTAURANT_EMAIL = 'restaurant@jambaarpay.com';
const RESTAURANT_PASSWORD = 'Restaurant@1234';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _state = signal<AuthState>({
    userId: null,
    token: null,
    role: null,
    profile: null,
    isAuthenticated: false,
  });

  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly profile = computed(() => this._state().profile);

  constructor(private storage: StorageService, private router: Router) {
    this.restoreSession();
  }

  login(form: LoginForm): boolean {
    // Mock authentication — replace with real API call
    const email = form.email.trim().toLowerCase();
    const mockUsers: Array<AdminProfile & { password: string }> = [
      {
        id: '1',
        name: 'Abdoulaye Diallo',
        email: ADMIN_EMAIL,
        role: USER_ROLES.admin,
        password: ADMIN_PASSWORD,
      },
      {
        id: '2',
        name: 'Sonatel SA',
        email: ENTERPRISE_EMAIL,
        role: USER_ROLES.enterprise,
        password: ENTERPRISE_PASSWORD,
      },
      {
        id: '3',
        name: 'Restaurant Le Djolof',
        email: RESTAURANT_EMAIL,
        role: USER_ROLES.restaurant,
        password: RESTAURANT_PASSWORD,
      },
    ];
    const user = mockUsers.find(item => item.email === email && item.password === form.password);

    if (user) {
      const mockToken = 'mock-jwt-token-' + Date.now();
      const profile: AdminProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const useSessionStorage = !form.rememberMe;
      this.storage.set(TOKEN_KEY, mockToken, useSessionStorage);
      this.storage.set(USER_KEY, JSON.stringify(profile), useSessionStorage);
      this.setAuthenticatedState(profile, mockToken);
      return true;
    }
    return false;
  }

  getLandingRoute(): string {
    if (this.getRole() === USER_ROLES.enterprise) {
      return '/enterprise-dashboard';
    }

    if (this.getRole() === USER_ROLES.restaurant) {
      return '/restaurant-dashboard';
    }

    return '/dashboard';
  }

  getRedirectRoute(): string {
    return this.isAuthenticated() ? this.getLandingRoute() : '/login';
  }

  getRole(): UserRole | null {
    return this._state().role ?? this.getProfile()?.role ?? null;
  }

  hasRole(roles: UserRole | UserRole[]): boolean {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const currentRole = this.getRole();
    return currentRole !== null && allowedRoles.includes(currentRole);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storage.get(TOKEN_KEY) ?? this.storage.get(TOKEN_KEY, true);
  }

  getProfile(): AdminProfile | null {
    return this._state().profile ?? this.readStoredProfile();
  }

  private restoreSession(): void {
    const token = this.getToken();
    const profile = this.readStoredProfile();

    if (!token || !profile) {
      this.clearSession();
      return;
    }

    this.setAuthenticatedState(profile, token);
  }

  private setAuthenticatedState(profile: AdminProfile, token: string): void {
    this._state.set({
      userId: profile.id,
      token,
      role: profile.role,
      profile,
      isAuthenticated: true,
    });
  }

  private clearSession(): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(USER_KEY);
    this._state.set({
      userId: null,
      token: null,
      role: null,
      profile: null,
      isAuthenticated: false,
    });
  }

  private readStoredProfile(): AdminProfile | null {
    const raw = this.storage.get(USER_KEY) ?? this.storage.get(USER_KEY, true);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      return this.isAdminProfile(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private isAdminProfile(value: unknown): value is AdminProfile {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const profile = value as Partial<AdminProfile>;
    return typeof profile.id === 'string'
      && typeof profile.name === 'string'
      && typeof profile.email === 'string'
      && typeof profile.role === 'string';
  }
}
