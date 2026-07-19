import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BFF_API_URL, isBffRequest } from '../bff-api.config';

export const correlationInterceptor: HttpInterceptorFn = (request, next) => {
  const bffApiUrl = inject(BFF_API_URL);

  if (!isBffRequest(request.url, bffApiUrl)) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      'X-Correlation-ID': createCorrelationId(),
      'X-Requested-With': 'XMLHttpRequest',
    },
  }));
};

function createCorrelationId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
