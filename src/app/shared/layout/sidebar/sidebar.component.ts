import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard Global',         icon: 'pi pi-th-large',      route: '/dashboard'   },
    { label: 'Gestion des entreprises',  icon: 'pi pi-building',      route: '/companies'   },
    { label: 'Gestion des restaurants',  icon: 'pi pi-home',          route: '/restaurants' },
    { label: 'Monitoring',               icon: 'pi pi-chart-bar',     route: '/monitoring'  },
    { label: "Journal d'audit",          icon: 'pi pi-user',          route: '/audit'       },
  ];

  profile = computed(() => this.auth.getProfile());

  constructor(private auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
