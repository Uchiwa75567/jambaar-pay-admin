import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { MockAuthRepository } from '../data-access/mock-auth.repository';
import { AuthFacade } from './auth.facade';
import { AUTH_REPOSITORY } from './auth.repository';

describe('AuthFacade', () => {
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };

  const setup = (): AuthFacade => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        MockAuthRepository,
        StorageService,
        { provide: AUTH_REPOSITORY, useExisting: MockAuthRepository },
        { provide: Router, useValue: router },
      ],
    });

    return TestBed.inject(AuthFacade);
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    router.navigate.calls.reset();
  });

  it('stores the session in localStorage when rememberMe is enabled', async () => {
    const service = setup();

    const authenticated = await firstValueFrom(service.login({
      email: 'admin@jambaarpay.com',
      password: 'Admin@1234',
      rememberMe: true,
    }));

    expect(authenticated).toBeTrue();
    expect(localStorage.getItem('jp_token')).toContain('mock-jwt-token-');
    expect(sessionStorage.getItem('jp_token')).toBeNull();
  });

  it('stores the session in sessionStorage when rememberMe is disabled', async () => {
    const service = setup();

    const authenticated = await firstValueFrom(service.login({
      email: 'admin@jambaarpay.com',
      password: 'Admin@1234',
      rememberMe: false,
    }));

    expect(authenticated).toBeTrue();
    expect(sessionStorage.getItem('jp_token')).toContain('mock-jwt-token-');
    expect(localStorage.getItem('jp_token')).toBeNull();
  });

  it('ignores corrupted persisted profiles without crashing', () => {
    localStorage.setItem('jp_token', 'stale-token');
    localStorage.setItem('jp_user', '{bad json');

    const service = setup();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getProfile()).toBeNull();
    expect(localStorage.getItem('jp_token')).toBeNull();
    expect(localStorage.getItem('jp_user')).toBeNull();
  });
});
