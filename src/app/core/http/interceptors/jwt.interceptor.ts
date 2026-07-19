import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacade } from '../../auth/application/auth.facade';
import { BFF_API_URL, isBffRequest } from '../bff-api.config';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const bffApiUrl = inject(BFF_API_URL);

  if (!isBffRequest(req.url, bffApiUrl)) {
    return next(req);
  }

  const token = inject(AuthFacade).getToken();

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
