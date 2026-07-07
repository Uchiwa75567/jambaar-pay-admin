import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurant-payments.component.html',
  styleUrls: ['./restaurant-payments.component.scss'],
})
export class RestaurantPaymentsComponent {
  amount = '';
  customer = '';
  tableNumber = '';

  readonly quickAmounts = ['2 000', '5 000', '10 000', '20 000'];
}
