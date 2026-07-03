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
  status: 'Validé' | 'En attente' | 'Échoué';
}

const MOCK_TRANSACTIONS: MonitoringTransaction[] = [
  { id: '#1231413', employee: 'Mermoz',      company: 'Entreprise 1', restaurant: 'Restaurant 1', amount: '2 000', date: '2026-04-15', status: 'Validé'    },
  { id: '#1231414', employee: 'Karak',        company: 'Entreprise 2', restaurant: 'Restaurant 2', amount: '3 500', date: '2026-04-15', status: 'Validé'    },
  { id: '#1231415', employee: 'Fann',         company: 'Entreprise 3', restaurant: 'Restaurant 3', amount: '1 200', date: '2026-04-15', status: 'En attente'},
  { id: '#1231416', employee: 'Keur Gorgui',  company: 'Entreprise 4', restaurant: 'Restaurant 4', amount: '4 800', date: '2026-04-14', status: 'Validé'    },
  { id: '#1231417', employee: 'Medina',        company: 'Entreprise 5', restaurant: 'Restaurant 5', amount: '900',   date: '2026-04-14', status: 'Échoué'    },
  { id: '#1231418', employee: 'Point E',       company: 'Entreprise 6', restaurant: 'Restaurant 6', amount: '2 600', date: '2026-04-13', status: 'Validé'    },
  { id: '#1231419', employee: 'Ouakam',        company: 'Entreprise 1', restaurant: 'Restaurant 1', amount: '1 800', date: '2026-04-13', status: 'Validé'    },
  { id: '#1231420', employee: 'Plateau',       company: 'Entreprise 2', restaurant: 'Restaurant 2', amount: '5 000', date: '2026-04-12', status: 'En attente'},
  { id: '#1231421', employee: 'Almadies',      company: 'Entreprise 3', restaurant: 'Restaurant 3', amount: '3 200', date: '2026-04-12', status: 'Validé'    },
  { id: '#1231422', employee: 'N\'Gor',        company: 'Entreprise 4', restaurant: 'Restaurant 4', amount: '750',   date: '2026-04-11', status: 'Échoué'    },
];

type StatusFilter = 'Tous' | 'Validé' | 'En attente' | 'Échoué';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule, MenuModule, KpiCardComponent, StatusBadgeComponent],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
})
export class MonitoringComponent {
  searchTerm   = signal('');
  statusFilter = signal<StatusFilter>('Tous');
  pageSize     = signal(6);
  currentPage  = signal(1);

  pageSizeMenuOpen = signal(false);
  filterMenuOpen   = signal(false);
  exportMenuOpen   = signal(false);

  pageSizeOptions = [6, 12, 18];
  filterOptions: StatusFilter[] = ['Tous', 'Validé', 'En attente', 'Échoué'];

  kpis = [
    { label: 'Validées',                value: 4790, change: 95,         icon: '', iconSrc: 'assets/icons/icon-check-circle.svg' },
    { label: 'En attentes',             value: '+20', change: 5,          icon: '', iconSrc: 'assets/icons/icon-pending.svg'      },
    { label: 'zéro transaction échoué', value: 0,    changeLabel: '0 %', icon: '', iconSrc: 'assets/icons/icon-failed.svg'       },
  ];

  filtered = computed(() => {
    const q  = this.searchTerm().toLowerCase();
    const sf = this.statusFilter();
    return MOCK_TRANSACTIONS.filter(t => {
      if (q && !(t.employee.toLowerCase().includes(q) || t.company.toLowerCase().includes(q) || t.restaurant.toLowerCase().includes(q))) return false;
      if (sf !== 'Tous' && t.status !== sf) return false;
      return true;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

  visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 6) return Array.from({ length: total }, (_, index) => index + 1);
    if (current <= 3) return [1, 2, 3, '...', total];
    if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  });

  transactions = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) {
      this.pageSizeMenuOpen.set(false);
      this.filterMenuOpen.set(false);
      this.exportMenuOpen.set(false);
    }
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.pageSizeMenuOpen.set(false);
  }

  setPage(page: number | '...'): void {
    if (page === '...') return;
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  prevPage(): void { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  toggleFilterMenu(): void   { this.filterMenuOpen.update(v => !v); }
  togglePageSizeMenu(): void { this.pageSizeMenuOpen.update(v => !v); }

  setFilter(f: StatusFilter): void {
    this.statusFilter.set(f);
    this.currentPage.set(1);
    this.filterMenuOpen.set(false);
  }

  toggleExportMenu(): void { this.exportMenuOpen.update(v => !v); }
  exportPDF(): void        { this.exportMenuOpen.set(false); }
  exportExcel(): void      { this.exportMenuOpen.set(false); }
}
