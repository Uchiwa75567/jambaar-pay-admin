import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  iconSrc: string;
  route?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private readonly adminNavItems: NavItem[] = [
    { label: 'Dashboard Global', iconSrc: 'assets/icons/icon-dashboard.svg', route: '/dashboard' },
    { label: 'Gestion des entreprises', iconSrc: 'assets/icons/icon-business.svg', route: '/companies' },
    { label: 'Gestion des restaurants', iconSrc: 'assets/icons/icon-restaurants.svg', route: '/restaurants' },
    { label: 'Monitoring', iconSrc: 'assets/icons/icon-monitoring.svg', route: '/monitoring' },
    { label: "Journal d'audit", iconSrc: 'assets/icons/icon-audit.svg', route: '/audit' },
  ];

  private readonly enterpriseNavItems: NavItem[] = [
    { label: 'Dashboard Global', iconSrc: 'assets/icons/icon-dashboard.svg', route: '/enterprise-dashboard' },
    { label: 'Gestion des salariés', iconSrc: 'assets/icons/icon-business.svg', disabled: true },
    { label: 'Historique', iconSrc: 'assets/icons/icon-audit.svg', disabled: true },
  ];

  constructor(private auth: AuthService) {}

  get navItems(): NavItem[] {
    return this.auth.getProfile()?.role === 'Entreprise' ? this.enterpriseNavItems : this.adminNavItems;
  }

  logout(): void {
    this.auth.logout();
  }
}
