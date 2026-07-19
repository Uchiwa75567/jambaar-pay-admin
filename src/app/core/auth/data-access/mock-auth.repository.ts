import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthRepository } from '../application/auth.repository';
import { AdminProfile, AuthSession, LoginCredentials, USER_ROLES } from '../domain/auth.models';

interface MockAccount extends AdminProfile {
  password: string;
}

const MOCK_ACCOUNTS: readonly MockAccount[] = [
  {
    id: '1',
    name: 'Abdoulaye Diallo',
    email: 'admin@jambaarpay.com',
    role: USER_ROLES.admin,
    password: 'Admin@1234',
  },
  {
    id: '2',
    name: 'Sonatel SA',
    email: 'entreprise@jambaarpay.com',
    role: USER_ROLES.enterprise,
    password: 'Entreprise@1234',
  },
  {
    id: '3',
    name: 'Restaurant Le Djolof',
    email: 'restaurant@jambaarpay.com',
    role: USER_ROLES.restaurant,
    password: 'Restaurant@1234',
  },
];

@Injectable({ providedIn: 'root' })
export class MockAuthRepository implements AuthRepository {
  login(credentials: LoginCredentials): Observable<AuthSession | null> {
    const email = credentials.email.trim().toLowerCase();
    const account = MOCK_ACCOUNTS.find(candidate =>
      candidate.email === email && candidate.password === credentials.password
    );

    if (!account) return of(null);

    const profile: AdminProfile = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      avatarUrl: account.avatarUrl,
    };
    return of({
      profile,
      accessToken: `mock-jwt-token-${Date.now()}`,
    });
  }
}
