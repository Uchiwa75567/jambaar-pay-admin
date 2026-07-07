import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { USER_ROLES } from '../../../core/models/auth.models';
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

  profile = this.auth.getProfile();

  constructor(private auth: AuthService) {}

  get isEnterprise(): boolean {
    return this.profile?.role === USER_ROLES.enterprise;
  }

  get isRestaurant(): boolean {
    return this.profile?.role === USER_ROLES.restaurant;
  }

  get showSettingsLink(): boolean {
    return !this.isEnterprise && !this.isRestaurant;
  }

  get initials(): string {
    if (!this.profile?.name) return 'A';
    return this.profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  logout(): void {
    this.auth.logout();
  }
}
