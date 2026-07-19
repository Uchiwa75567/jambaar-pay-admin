import { Routes } from '@angular/router';
import { USER_ROLES } from '../../core/auth/domain/auth.models';
import { protectedPage } from '../../core/routing/protected-page';

const ADMIN_ROLES = [USER_ROLES.admin] as const;

export const ADMIN_ROUTES: Routes = [
  protectedPage({
    path: 'dashboard',
    title: 'Dashboard Global',
    data: { subtitle: "Vue d'ensemble de la plateforme Jambaar Pay" },
    loadComponent: () => import('../dashboard/dashboard.component').then(module => module.DashboardComponent),
  }, ADMIN_ROLES),
  protectedPage({
    path: 'companies',
    title: 'Gestion des Entreprises',
    data: { subtitle: 'Gérer toutes les entreprises partenaires' },
    loadComponent: () => import('../companies/companies-list/companies-list.component').then(module => module.CompaniesListComponent),
  }, ADMIN_ROLES),
  protectedPage({
    path: 'companies/add',
    title: 'Gestion des Entreprises',
    data: { subtitle: 'Gérer toutes les entreprises partenaires' },
    loadComponent: () => import('../companies/company-add/company-add.component').then(module => module.CompanyAddComponent),
  }, ADMIN_ROLES),
  protectedPage({
    path: 'restaurants',
    title: 'Gestion des Restaurants',
    data: { subtitle: 'Gérer tous les restaurants partenaires' },
    loadComponent: () => import('../restaurants/restaurants-list/restaurants-list.component').then(module => module.RestaurantsListComponent),
  }, ADMIN_ROLES),
  protectedPage({
    path: 'restaurants/add',
    title: 'Gestion des Restaurants',
    data: { subtitle: 'Gérer tous les restaurants partenaires' },
    loadComponent: () => import('../restaurants/restaurant-add/restaurant-add.component').then(module => module.RestaurantAddComponent),
  }, ADMIN_ROLES),
  protectedPage({
    path: 'monitoring',
    title: 'Monitoring des transactions',
    data: { subtitle: 'Surveillez toutes les transactions en temps réel' },
    loadComponent: () => import('../monitoring/monitoring.component').then(module => module.MonitoringComponent),
  }, ADMIN_ROLES),
  protectedPage({
    path: 'audit',
    title: "Journal d'Audit",
    data: { subtitle: "Consultez l'historique des actions système" },
    loadComponent: () => import('../audit/audit.component').then(module => module.AuditComponent),
  }, ADMIN_ROLES),
  protectedPage({
    path: 'settings',
    title: 'Paramètres du système',
    data: { subtitle: 'Configurez la plateforme Jambaar Pay' },
    loadComponent: () => import('../settings/settings.component').then(module => module.SettingsComponent),
  }, ADMIN_ROLES),
];
