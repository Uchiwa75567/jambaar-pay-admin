import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Restaurant } from '../../../core/models/restaurant.models';

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Restaurant 1', address: 'Mermoz',      totalTransactions: 123, totalVolume: 0, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '2', name: 'Restaurant 2', address: 'Karak',       totalTransactions: 123, totalVolume: 0, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '3', name: 'Restaurant 3', address: 'Fann',        totalTransactions: 123, totalVolume: 0, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '4', name: 'Restaurant 4', address: 'Keur Gorgui', totalTransactions: 123, totalVolume: 0, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '5', name: 'Restaurant 5', address: 'Medina',      totalTransactions: 123, totalVolume: 0, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '6', name: 'Restaurant 6', address: 'Point E',     totalTransactions: 123, totalVolume: 0, registrationDate: '2026-04-15', status: 'Actif' },
];

@Component({
  selector: 'app-restaurants-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, MenuModule, StatusBadgeComponent],
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss'],
})
export class RestaurantsListComponent {
  searchTerm   = signal('');
  statusFilter = signal('Tous');

  restaurants = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return q ? MOCK_RESTAURANTS.filter(r => r.name.toLowerCase().includes(q)) : MOCK_RESTAURANTS;
  });

  getMenuItems(restaurant: Restaurant): MenuItem[] {
    return [
      { label: 'Voir détails', icon: 'pi pi-eye'    },
      { label: 'Modifier',     icon: 'pi pi-pencil' },
      { label: 'Désactiver',   icon: 'pi pi-ban',   styleClass: 'text-red-500' },
    ];
  }
}
