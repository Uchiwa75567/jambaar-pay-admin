import { Component, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Company } from '../../../core/models/company.models';

const MOCK_COMPANIES: Company[] = [
  { id: '1',  name: 'Sonatel SA',       employeeCount: 567, totalBalance: 878_929, registrationDate: '2026-04-15', status: 'Actif'   },
  { id: '2',  name: 'Orange SN',        employeeCount: 342, totalBalance: 450_000, registrationDate: '2026-04-10', status: 'Actif'   },
  { id: '3',  name: 'Ecobank Sénégal',  employeeCount: 210, totalBalance: 320_500, registrationDate: '2026-03-22', status: 'Inactif' },
  { id: '4',  name: 'Expresso Télécom', employeeCount: 180, totalBalance: 215_300, registrationDate: '2026-03-15', status: 'Actif'   },
  { id: '5',  name: 'Total Sénégal',    employeeCount: 420, totalBalance: 610_000, registrationDate: '2026-03-01', status: 'Actif'   },
  { id: '6',  name: 'Tigo SN',          employeeCount: 290, totalBalance: 380_750, registrationDate: '2026-02-18', status: 'Inactif' },
  { id: '7',  name: 'CBAO',             employeeCount: 150, totalBalance: 190_000, registrationDate: '2026-02-05', status: 'Actif'   },
  { id: '8',  name: 'Société Générale', employeeCount: 320, totalBalance: 500_200, registrationDate: '2026-01-20', status: 'Actif'   },
  { id: '9',  name: 'Attijariwafa',     employeeCount: 275, totalBalance: 430_100, registrationDate: '2026-01-12', status: 'Inactif' },
  { id: '10', name: 'BHS Sénégal',      employeeCount: 130, totalBalance: 160_000, registrationDate: '2025-12-10', status: 'Actif'   },
  { id: '11', name: 'Orabank SN',        employeeCount: 195, totalBalance: 280_400, registrationDate: '2025-11-22', status: 'Actif'   },
  { id: '12', name: 'UBA Sénégal',       employeeCount: 110, totalBalance: 140_600, registrationDate: '2025-10-15', status: 'Inactif' },
];

type StatusFilter = 'Tous' | 'Actif' | 'Inactif';
type DateFilter   = 'Tous' | 'Ce mois' | 'Ce trimestre' | 'Cette année';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, InputTextModule, MenuModule, StatusBadgeComponent],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
})
export class CompaniesListComponent {
  searchTerm   = signal('');
  statusFilter = signal<StatusFilter>('Tous');
  dateFilter   = signal<DateFilter>('Tous');
  pageSize     = signal(6);
  currentPage  = signal(1);

  pageSizeMenuOpen = signal(false);
  filterMenuOpen   = signal(false);

  pageSizeOptions  = [5, 6, 10, 25, 50];
  statusOptions: StatusFilter[] = ['Tous', 'Actif', 'Inactif'];
  dateOptions: DateFilter[]     = ['Tous', 'Ce mois', 'Ce trimestre', 'Cette année'];

  get filterLabel(): string {
    const s = this.statusFilter();
    const d = this.dateFilter();
    if (s !== 'Tous') return s;
    if (d !== 'Tous') return d;
    return 'Tous';
  }

  private get now() { return new Date(); }

  private inDateRange(dateStr: string, range: DateFilter): boolean {
    if (range === 'Tous') return true;
    const d = new Date(dateStr);
    const now = this.now;
    if (range === 'Ce mois')      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    if (range === 'Ce trimestre') return d.getFullYear() === now.getFullYear() && Math.floor(d.getMonth() / 3) === Math.floor(now.getMonth() / 3);
    if (range === 'Cette année')  return d.getFullYear() === now.getFullYear();
    return true;
  }

  filtered = computed(() => {
    const q  = this.searchTerm().toLowerCase();
    const sf = this.statusFilter();
    const df = this.dateFilter();
    return MOCK_COMPANIES.filter(c => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (sf !== 'Tous' && c.status !== sf) return false;
      if (!this.inDateRange(c.registrationDate, df)) return false;
      return true;
    });
  });

  totalPages  = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

  visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const curr  = this.currentPage();
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (curr > 3) pages.push('...');
    for (let i = Math.max(2, curr - 1); i <= Math.min(total - 1, curr + 1); i++) pages.push(i);
    if (curr < total - 2) pages.push('...');
    if (total > 1) pages.push(total);
    return pages;
  });

  companies = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) {
      this.pageSizeMenuOpen.set(false);
      this.filterMenuOpen.set(false);
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

  setStatusFilter(s: StatusFilter): void {
    this.statusFilter.set(s);
    this.dateFilter.set('Tous');
    this.currentPage.set(1);
    this.filterMenuOpen.set(false);
  }

  setDateFilter(d: DateFilter): void {
    this.dateFilter.set(d);
    this.statusFilter.set('Tous');
    this.currentPage.set(1);
    this.filterMenuOpen.set(false);
  }

  toggleFilterMenu(): void   { this.filterMenuOpen.update(v => !v); }
  togglePageSizeMenu(): void { this.pageSizeMenuOpen.update(v => !v); }

  getMenuItems(company: Company): MenuItem[] {
    return [
      { label: 'Voir détails', icon: 'pi pi-eye' },
      { label: 'Modifier',     icon: 'pi pi-pencil' },
      { label: 'Désactiver',   icon: 'pi pi-ban', styleClass: 'text-red-500' },
    ];
  }
}
