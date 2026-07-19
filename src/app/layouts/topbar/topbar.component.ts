import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../../core/auth/application/auth.facade';
import { AdminProfile, USER_ROLES } from '../../core/auth/domain/auth.models';

@Component({
    selector: 'app-topbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  private readonly auth = inject(AuthFacade);

  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle = '';

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
