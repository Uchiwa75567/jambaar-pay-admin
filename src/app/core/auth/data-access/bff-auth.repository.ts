import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BffApiClient } from '../../http/bff-api.client';
import { AuthRepository } from '../application/auth.repository';
import { AdminProfile, AuthSession, isUserRole, LoginCredentials } from '../domain/auth.models';

interface AuthSessionDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  accessToken?: string;
}

@Injectable({ providedIn: 'root' })
export class BffAuthRepository implements AuthRepository {
  private readonly api = inject(BffApiClient);

  login(credentials: LoginCredentials): Observable<AuthSession> {
    return this.api.post<AuthSessionDto, LoginCredentials>('auth/login', credentials).pipe(
      map(dto => ({
        profile: this.mapProfile(dto),
        accessToken: dto.accessToken,
      })),
    );
  }

  private mapProfile(dto: AuthSessionDto): AdminProfile {
    if (!isUserRole(dto.user.role)) {
      throw new Error(`Unsupported user role returned by BFF: ${dto.user.role}`);
    }

    return {
      id: dto.user.id,
      name: dto.user.name,
      email: dto.user.email,
      role: dto.user.role,
      avatarUrl: dto.user.avatarUrl,
    };
  }
}
