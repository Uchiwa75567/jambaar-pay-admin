import { Component, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

export interface MonitoringTransaction {
  id: string;
  employee: string;
  company: string;
  restaurant: string;
  amount: string;
  date: string;
  status: 'Validé';
}

const MOCK_TRANSACTIONS: MonitoringTransaction[] = [
  { id: '#1231413', employee: 'Mermoz',      company: 'Entreprise 1', restaurant: 'Restaurant 1', amount: '2 000', date: '2026-04-15', status: 'Validé' },
  { id: '#1231413', employee: 'Karak',       company: 'Entreprise 2', restaurant: 'Restaurant 2', amount: '3 500', date: '2026-04-15', status: 'Validé' },
  { id: '#1231413', employee: 'Fann',        company: 'Entreprise 3', restaurant: 'Restaurant 3', amount: '1 200', date: '2026-04-15', status: 'Validé' },
  { id: '#1231413', employee: 'Keur Gorgui', company: 'Entreprise 4', restaurant: 'Restaurant 4', amount: '4 800', date: '2026-04-15', status: 'Validé' },
  { id: '#1231413', employee: 'Medina',      company: 'Entreprise 5', restaurant: 'Restaurant 5', amount: '900',   date: '2026-04-15', status: 'Validé' },
  { id: '#1231413', employee: 'Point E',     company: 'Entreprise 6', restaurant: 'Restaurant 6', amount: '2 600', date: '2026-04-15', status: 'Validé' },
];

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule, MenuModule, KpiCardComponent, StatusBadgeComponent],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
})
export class MonitoringComponent {
  searchTerm     = signal('');
  statusFilter   = signal('Tous');
  exportMenuOpen = signal(false);

  constructor(private el: ElementRef) {}

  toggleExportMenu(): void { this.exportMenuOpen.update(v => !v); }
  exportPDF(): void        { this.exportMenuOpen.set(false); }
  exportExcel(): void      { this.exportMenuOpen.set(false); }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) {
      this.exportMenuOpen.set(false);
    }
  }

  kpis = [
    { label: 'Validées',               value: 4790,  change: 95, icon: '', iconSrc: 'assets/icons/icon-check-circle.svg' },
    { label: 'En attentes',            value: '+20',  change: 5,  icon: '', iconSrc: 'assets/icons/icon-pending.svg'      },
    { label: 'zéro transaction échoué', value: 0,     changeLabel: '0 %', icon: '', iconSrc: 'assets/icons/icon-failed.svg' },
  ];

  transactions = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return q ? MOCK_TRANSACTIONS.filter(t =>
      t.employee.toLowerCase().includes(q) ||
      t.company.toLowerCase().includes(q)  ||
      t.restaurant.toLowerCase().includes(q)
    ) : MOCK_TRANSACTIONS;
  });
}
