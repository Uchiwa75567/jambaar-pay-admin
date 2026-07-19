
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-restaurant-settings',
    imports: [FormsModule],
    templateUrl: './restaurant-settings.component.html',
    styleUrls: ['./restaurant-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantSettingsComponent {
  restaurantName = 'Restaurant Le Djoloff';
  managerName = 'Mamadou Djoloff';
  phone = '771234567';
  email = 'contact@ledjoloff.sn';
  address = 'Plateau, Dakar';
  ninea = '000000000000';

  currentPassword = '........';
  newPassword = '........';
  confirmPassword = '........';

  paymentAlertEnabled = true;
  confirmationSoundEnabled = false;
}
