import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Company } from '../../../core/models/company.models';

const MOCK_COMPANIES: Company[] = Array.from({ length: 6 }, (_, index) => ({
  id: String(index + 1),
  name: 'Entreprise 1',
  employeeCount: 567,
  totalBalance: 878_929,
  registrationDate: '2026-04-15',
  status: 'Actif',
}));

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, MenuModule, StatusBadgeComponent],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
})
export class CompaniesListComponent {
  searchTerm = signal('');
  statusFilter = signal('Tous');

  companies = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return q ? MOCK_COMPANIES.filter(c => c.name.toLowerCase().includes(q)) : MOCK_COMPANIES;
  });

  getMenuItems(company: Company): MenuItem[] {
    return [
      { label: 'Voir détails', icon: 'pi pi-eye' },
      { label: 'Modifier', icon: 'pi pi-pencil' },
      { label: 'Désactiver', icon: 'pi pi-ban', styleClass: 'text-red-500' },
    ];
  }
}
