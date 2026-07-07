import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

function getAllowedRoles(route: ActivatedRouteSnapshot): UserRole[] {
  return (route.data?.['roles'] as UserRole[] | undefined) ?? [];
}

export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = getAllowedRoles(route);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree([auth.getRedirectRoute()]);
  }

  if (allowedRoles.length === 0 || auth.hasRole(allowedRoles)) {
    return true;
  }

  return router.createUrlTree([auth.getRedirectRoute()]);
};
