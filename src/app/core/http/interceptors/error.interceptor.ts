import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthFacade } from '../../auth/application/auth.facade';
import { BFF_API_URL, isBffRequest } from '../bff-api.config';
import { mapBffHttpError } from '../models/bff-http.error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFacade);
  const bffApiUrl = inject(BFF_API_URL);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && isBffRequest(req.url, bffApiUrl)) {
        auth.logout();
      }

      return throwError(() => isBffRequest(req.url, bffApiUrl) ? mapBffHttpError(err) : err);
    })
  );
};
