import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurant-settings.component.html',
  styleUrls: ['./restaurant-settings.component.scss'],
})
export class RestaurantSettingsComponent {
  restaurantName = 'Restaurant Le Djoloff';
  managerName = 'Mamadou Djoloff';
  phone = '+221 77 123 45 67';
  email = 'contact@ledjoloff.sn';
  address = 'Plateau, Dakar';
  ninea = '000000000000';

  currentPassword = '........';
  newPassword = '........';
  confirmPassword = '........';

  paymentAlertEnabled = true;
  confirmationSoundEnabled = false;
}
