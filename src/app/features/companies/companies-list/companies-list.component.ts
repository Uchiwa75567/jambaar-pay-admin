import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { FcfaCurrencyPipe } from '../../../shared/pipes/fcfa-currency.pipe';
import { DateFrPipe } from '../../../shared/pipes/date-fr.pipe';
import { Company } from '../../../core/models/company.models';

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Sonatel',       employeeCount: 3200, totalBalance: 15_400_000, registrationDate: '2023-03-12', status: 'Actif'   },
  { id: '2', name: 'Ecobank',       employeeCount: 850,  totalBalance: 6_200_000,  registrationDate: '2023-05-20', status: 'Actif'   },
  { id: '3', name: 'CBAO',          employeeCount: 420,  totalBalance: 2_850_000,  registrationDate: '2023-07-08', status: 'Actif'   },
  { id: '4', name: 'Senelec',       employeeCount: 2100, totalBalance: 9_700_000,  registrationDate: '2023-01-15', status: 'Inactif' },
  { id: '5', name: 'Orange Money',  employeeCount: 650,  totalBalance: 4_300_000,  registrationDate: '2023-09-30', status: 'Actif'   },
  { id: '6', name: 'BHS',           employeeCount: 310,  totalBalance: 1_950_000,  registrationDate: '2023-11-02', status: 'Actif'   },
  { id: '7', name: 'Air Sénégal',   employeeCount: 890,  totalBalance: 5_100_000,  registrationDate: '2023-06-18', status: 'Actif'   },
  { id: '8', name: 'Dangote Dakar', employeeCount: 540,  totalBalance: 3_620_000,  registrationDate: '2024-01-05', status: 'Inactif' },
];

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, MenuModule, StatusBadgeComponent, FcfaCurrencyPipe, DateFrPipe],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
})
export class CompaniesListComponent {
  searchTerm = signal('');
  statusFilter = signal('Tous');
  statusOptions = ['Tous', 'Actif', 'Inactif'];

  companies = computed(() => {
    let list = MOCK_COMPANIES;
    const q = this.searchTerm().toLowerCase();
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q));
    if (this.statusFilter() !== 'Tous') list = list.filter(c => c.status === this.statusFilter());
    return list;
  });

  getMenuItems(company: Company): MenuItem[] {
    return [
      { label: 'Voir détails',   icon: 'pi pi-eye' },
      { label: 'Modifier',       icon: 'pi pi-pencil' },
      { label: 'Désactiver',     icon: 'pi pi-ban', styleClass: 'text-red-500' },
    ];
  }
}
