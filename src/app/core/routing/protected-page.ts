import { Route } from '@angular/router';
import { roleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../auth/domain/auth.models';
import { PageRouteData } from './page-route-data';

export function protectedPage(
  route: Omit<Route, 'canActivate' | 'data'> & { data: PageRouteData },
  roles: readonly UserRole[],
): Route {
  return {
    ...route,
    canActivate: [roleGuard],
    data: { ...route.data, roles },
  };
}
