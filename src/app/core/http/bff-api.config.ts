import { inject, InjectionToken } from '@angular/core';
import { APP_RUNTIME_CONFIG } from '../config/runtime-config';

/**
 * Single HTTP boundary exposed to the frontend.
 * Override this token at bootstrap when the deployed BFF uses an absolute URL.
 */
export const BFF_API_URL = new InjectionToken<string>('BFF_API_URL', {
  providedIn: 'root',
  factory: () => inject(APP_RUNTIME_CONFIG).bffApiUrl,
});

export function isBffRequest(requestUrl: string, bffApiUrl: string): boolean {
  const baseOrigin = typeof location === 'undefined' ? 'http://localhost' : location.origin;
  const normalizedRequestUrl = new URL(requestUrl, baseOrigin);
  const normalizedBffApiUrl = new URL(bffApiUrl, baseOrigin);
  const bffPath = stripTrailingSlash(normalizedBffApiUrl.pathname);

  return normalizedRequestUrl.origin === normalizedBffApiUrl.origin
    && (normalizedRequestUrl.pathname === bffPath
      || normalizedRequestUrl.pathname.startsWith(`${bffPath}/`));
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}
