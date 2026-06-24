import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { AuthState, AdminProfile, LoginForm } from '../models/auth.models';

const TOKEN_KEY = 'jp_token';
const USER_KEY  = 'jp_user';
const ADMIN_EMAIL = 'admin@jambaarpay.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ENTERPRISE_EMAIL = 'entreprise@jambaarpay.com';
const ENTERPRISE_PASSWORD = 'Entreprise@1234';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _state = signal<AuthState>({
    userId: null,
    token: null,
    role: null,
    isAuthenticated: false,
  });

  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly currentUser     = computed(() => this._state());

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
        role: 'Admin Principal',
        password: ADMIN_PASSWORD,
      },
      {
        id: '2',
        name: 'Sonatel SA',
        email: ENTERPRISE_EMAIL,
        role: 'Entreprise',
        password: ENTERPRISE_PASSWORD,
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
      const store = !form.rememberMe;
      this.storage.set(TOKEN_KEY, mockToken, store);
      this.storage.set(USER_KEY, JSON.stringify(profile), store);
      this._state.set({
        userId: profile.id,
        token: mockToken,
        role: profile.role,
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  }

  getLandingRoute(): string {
    return this.getProfile()?.role === 'Entreprise' ? '/enterprise-dashboard' : '/dashboard';
  }

  logout(): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(USER_KEY);
    this._state.set({ userId: null, token: null, role: null, isAuthenticated: false });
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storage.get(TOKEN_KEY) ?? this.storage.get(TOKEN_KEY, true);
  }

  getProfile(): AdminProfile | null {
    const raw = this.storage.get(USER_KEY) ?? this.storage.get(USER_KEY, true);
    return raw ? JSON.parse(raw) : null;
  }

  private restoreSession(): void {
    const token = this.storage.get(TOKEN_KEY) ?? this.storage.get(TOKEN_KEY, true);
    const raw   = this.storage.get(USER_KEY)  ?? this.storage.get(USER_KEY, true);
    if (token && raw) {
      const profile: AdminProfile = JSON.parse(raw);
      this._state.set({ userId: profile.id, token, role: profile.role, isAuthenticated: true });
    }
  }
}
