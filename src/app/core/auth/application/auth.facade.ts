import { computed, Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { AdminProfile, AuthState, isUserRole, LoginForm, UserRole, USER_ROLES } from '../domain/auth.models';
import { AUTH_REPOSITORY, AuthRepository } from './auth.repository';

const TOKEN_KEY = 'jp_token';
const USER_KEY  = 'jp_user';
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly repository = inject<AuthRepository>(AUTH_REPOSITORY);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly state = signal<AuthState>({
    userId: null,
    token: null,
    role: null,
    profile: null,
    isAuthenticated: false,
  });

  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly profile = computed(() => this.state().profile);

  constructor() {
    this.restoreSession();
  }

  login(form: LoginForm): Observable<boolean> {
    return this.repository.login({ email: form.email, password: form.password }).pipe(
      map(session => {
        if (!session) return false;

        const useSessionStorage = !form.rememberMe;
        if (session.accessToken) {
          this.storage.set(TOKEN_KEY, session.accessToken, useSessionStorage);
        }
        this.storage.set(USER_KEY, JSON.stringify(session.profile), useSessionStorage);
        this.setAuthenticatedState(session.profile, session.accessToken ?? null);
        return true;
      }),
    );
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
    return this.state().role ?? this.getProfile()?.role ?? null;
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
    return this.state().profile ?? this.readStoredProfile();
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

  private setAuthenticatedState(profile: AdminProfile, token: string | null): void {
    this.state.set({
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
    this.state.set({
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
      && isUserRole(profile.role);
  }
}
