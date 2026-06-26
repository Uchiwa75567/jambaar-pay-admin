import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
    return this.profile?.role === 'Entreprise';
  }

  get initials(): string {
    if (!this.profile?.name) return 'A';
    return this.profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  logout(): void {
    this.auth.logout();
  }
}
