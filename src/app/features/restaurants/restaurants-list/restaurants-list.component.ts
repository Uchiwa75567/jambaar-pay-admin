import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { FcfaCurrencyPipe } from '../../../shared/pipes/fcfa-currency.pipe';
import { DateFrPipe } from '../../../shared/pipes/date-fr.pipe';
import { Restaurant } from '../../../core/models/restaurant.models';

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Le Baobab',      address: 'Plateau, Dakar',        totalTransactions: 142, totalVolume: 6_800_000, registrationDate: '2023-04-10', status: 'Actif'   },
  { id: '2', name: 'Teranga Food',   address: 'Almadies, Dakar',       totalTransactions: 98,  totalVolume: 4_200_000, registrationDate: '2023-06-22', status: 'Actif'   },
  { id: '3', name: 'Chez Aminata',   address: 'Médina, Dakar',         totalTransactions: 76,  totalVolume: 3_100_000, registrationDate: '2023-08-01', status: 'Actif'   },
  { id: '4', name: 'Dakar Saveurs',  address: 'Ouakam, Dakar',         totalTransactions: 54,  totalVolume: 2_400_000, registrationDate: '2023-09-15', status: 'Actif'   },
  { id: '5', name: 'La Palmeraie',   address: 'Fann, Dakar',           totalTransactions: 20,  totalVolume: 850_000,   registrationDate: '2023-11-20', status: 'Inactif' },
];

@Component({
  selector: 'app-restaurants-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, StatusBadgeComponent, FcfaCurrencyPipe, DateFrPipe],
  templateUrl: './restaurants-list.component.html',
})
export class RestaurantsListComponent {
  restaurants = MOCK_RESTAURANTS;
}
