import { Route, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { landingGuard } from './core/guards/landing.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole, USER_ROLES } from './core/models/auth.models';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EnterpriseDashboardComponent } from './features/enterprise-dashboard/enterprise-dashboard.component';
import { EnterpriseEmployeesComponent } from './features/enterprise-employees/enterprise-employees.component';
import { EnterpriseEmployeeAddComponent } from './features/enterprise-employee-add/enterprise-employee-add.component';
import { EnterpriseHistoryComponent } from './features/enterprise-history/enterprise-history.component';
import { RestaurantDashboardComponent } from './features/restaurant-dashboard/restaurant-dashboard.component';
import { RestaurantPaymentsComponent } from './features/restaurant-payments/restaurant-payments.component';
import { RestaurantSettingsComponent } from './features/restaurant-settings/restaurant-settings.component';
import { CompaniesListComponent } from './features/companies/companies-list/companies-list.component';
import { CompanyAddComponent } from './features/companies/company-add/company-add.component';
import { RestaurantsListComponent } from './features/restaurants/restaurants-list/restaurants-list.component';
import { RestaurantAddComponent } from './features/restaurants/restaurant-add/restaurant-add.component';
import { MonitoringComponent } from './features/monitoring/monitoring.component';
import { AuditComponent } from './features/audit/audit.component';
import { SettingsComponent } from './features/settings/settings.component';

function withRoles(routes: Route[], roles: UserRole[]): Route[] {
  return routes.map(route => ({
    ...route,
    canActivate: [...(route.canActivate ?? []), roleGuard],
    data: { ...(route.data ?? {}), roles },
  }));
}

const adminRoutes = withRoles(
  [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'companies', component: CompaniesListComponent },
    { path: 'companies/add', component: CompanyAddComponent },
    { path: 'restaurants', component: RestaurantsListComponent },
    { path: 'restaurants/add', component: RestaurantAddComponent },
    { path: 'monitoring', component: MonitoringComponent },
    { path: 'audit', component: AuditComponent },
  ],
  [USER_ROLES.admin]
);

const enterpriseRoutes = withRoles(
  [
    { path: 'enterprise-dashboard', component: EnterpriseDashboardComponent },
    { path: 'enterprise-employees', component: EnterpriseEmployeesComponent },
    { path: 'enterprise-employees/add', component: EnterpriseEmployeeAddComponent },
    { path: 'enterprise-history', component: EnterpriseHistoryComponent },
  ],
  [USER_ROLES.enterprise]
);

const restaurantRoutes = withRoles(
  [
    { path: 'restaurant-dashboard', component: RestaurantDashboardComponent },
    { path: 'restaurant-payments', component: RestaurantPaymentsComponent },
    { path: 'restaurant-settings', component: RestaurantSettingsComponent },
  ],
  [USER_ROLES.restaurant]
);

export const routes: Routes = [
  { path: '', canActivate: [landingGuard], children: [] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      ...adminRoutes,
      ...enterpriseRoutes,
      ...restaurantRoutes,
      { path: 'settings', component: SettingsComponent },
    ],
  },
  { path: '**', canActivate: [landingGuard], children: [] },
];
