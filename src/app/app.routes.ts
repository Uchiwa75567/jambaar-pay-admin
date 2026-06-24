import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EnterpriseDashboardComponent } from './features/enterprise-dashboard/enterprise-dashboard.component';
import { EnterpriseEmployeesComponent } from './features/enterprise-employees/enterprise-employees.component';
import { EnterpriseEmployeeAddComponent } from './features/enterprise-employee-add/enterprise-employee-add.component';
import { EnterpriseHistoryComponent } from './features/enterprise-history/enterprise-history.component';
import { CompaniesListComponent } from './features/companies/companies-list/companies-list.component';
import { CompanyAddComponent } from './features/companies/company-add/company-add.component';
import { RestaurantsListComponent } from './features/restaurants/restaurants-list/restaurants-list.component';
import { RestaurantAddComponent } from './features/restaurants/restaurant-add/restaurant-add.component';
import { MonitoringComponent } from './features/monitoring/monitoring.component';
import { AuditComponent } from './features/audit/audit.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',       component: DashboardComponent       },
      { path: 'enterprise-dashboard', component: EnterpriseDashboardComponent },
      { path: 'enterprise-employees', component: EnterpriseEmployeesComponent },
      { path: 'enterprise-employees/add', component: EnterpriseEmployeeAddComponent },
      { path: 'enterprise-history', component: EnterpriseHistoryComponent },
      { path: 'companies',       component: CompaniesListComponent    },
      { path: 'companies/add',   component: CompanyAddComponent       },
      { path: 'restaurants',     component: RestaurantsListComponent  },
      { path: 'restaurants/add', component: RestaurantAddComponent    },
      { path: 'monitoring',      component: MonitoringComponent       },
      { path: 'audit',           component: AuditComponent            },
      { path: 'settings',        component: SettingsComponent         },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
