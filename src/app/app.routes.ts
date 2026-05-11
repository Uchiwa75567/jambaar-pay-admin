import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
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
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',       component: DashboardComponent       },
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
