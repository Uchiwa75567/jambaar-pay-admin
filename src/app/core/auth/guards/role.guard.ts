import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../application/auth.facade';
import { UserRole } from '../domain/auth.models';

function getAllowedRoles(route: ActivatedRouteSnapshot): UserRole[] {
  return (route.data?.['roles'] as UserRole[] | undefined) ?? [];
}

export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthFacade);
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
