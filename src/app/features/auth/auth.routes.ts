import { Routes } from '@angular/router';
import { guestGuard } from '../../core/auth/guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Connexion | Jambaar Pay',
    canActivate: [guestGuard],
    loadComponent: () => import('./login/login.component').then(module => module.LoginComponent),
  },
  {
    path: 'register',
    title: 'Inscription | Jambaar Pay',
    canActivate: [guestGuard],
    loadComponent: () => import('./register/register.component').then(module => module.RegisterComponent),
  },
];
