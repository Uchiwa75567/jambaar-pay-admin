import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminProfile, USER_ROLES } from '../../../core/models/auth.models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle = '';

  constructor(private auth: AuthService) {}

  get profile(): AdminProfile | null {
    return this.auth.profile();
  }

  get isEnterprise(): boolean {
    return this.profile?.role === USER_ROLES.enterprise;
  }

  get isRestaurant(): boolean {
    return this.profile?.role === USER_ROLES.restaurant;
  }

  get showSettingsLink(): boolean {
    return !this.isEnterprise && !this.isRestaurant;
  }

  logout(): void {
    this.auth.logout();
  }
}
