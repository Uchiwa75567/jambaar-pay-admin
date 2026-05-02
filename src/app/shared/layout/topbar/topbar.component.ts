import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle = '';

  profile = this.auth.getProfile();

  constructor(private auth: AuthService) {}

  get initials(): string {
    if (!this.profile?.name) return 'A';
    return this.profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}
