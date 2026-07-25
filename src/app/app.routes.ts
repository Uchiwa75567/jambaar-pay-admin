import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { landingGuard } from './core/auth/guards/landing.guard';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { ENTERPRISE_ROUTES } from './features/enterprise/enterprise.routes';
import { RESTAURANT_ROUTES } from './features/restaurant/restaurant.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'JambaarPay | Portail',
    canActivate: [landingGuard],
    loadComponent: () => import('./features/landing/landing.component').then(module => module.LandingComponent),
  },
  ...AUTH_ROUTES,
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(module => module.MainLayoutComponent),
    children: [
      ...ADMIN_ROUTES,
      ...ENTERPRISE_ROUTES,
      ...RESTAURANT_ROUTES,
    ],
  },
  { path: '**', redirectTo: '' },
];
