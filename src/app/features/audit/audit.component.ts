import { Component, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

export interface AuditLog {
  action: string;
  user: string;
  details: string;
  date: string;
}

const MOCK_LOGS: AuditLog[] = [
  { action: 'Création entreprise',  user: 'Admin Principal', details: 'Sonatel SA ajoutée',         date: '2024-01-15 10:30' },
  { action: 'Création restaurant',  user: 'Admin Principal', details: 'Le Djolof ajouté',            date: '2024-01-15 11:00' },
  { action: 'Modification',         user: 'Admin Principal', details: 'Orange SN modifiée',          date: '2024-01-14 09:15' },
  { action: 'Création entreprise',  user: 'Admin Principal', details: 'Ecobank ajoutée',             date: '2024-01-14 08:30' },
  { action: 'Création restaurant',  user: 'Admin Principal', details: 'La Téranga ajoutée',          date: '2024-01-13 14:45' },
  { action: 'Modification',         user: 'Admin Principal', details: 'Thiébou Ndar modifié',        date: '2024-01-13 13:20' },
  { action: 'Suppression',          user: 'Admin Principal', details: 'Restaurant FoodGood supprimé',date: '2024-01-12 16:00' },
  { action: 'Création entreprise',  user: 'Admin Principal', details: 'Total SN ajoutée',            date: '2024-01-12 10:00' },
  { action: 'Modification',         user: 'Admin Principal', details: 'Tigo modifiée',               date: '2024-01-11 11:30' },
  { action: 'Création restaurant',  user: 'Admin Principal', details: 'Dakar Bistro ajouté',         date: '2024-01-11 09:45' },
  { action: 'Création entreprise',  user: 'Admin Principal', details: 'CBAO ajoutée',                date: '2024-01-10 14:00' },
  { action: 'Suppression',          user: 'Admin Principal', details: 'Ancienne entreprise retirée', date: '2024-01-10 08:00' },
];

type ActionFilter = 'Tous' | 'Création entreprise' | 'Création restaurant' | 'Modification' | 'Suppression';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent {
  searchTerm   = signal('');
  actionFilter = signal<ActionFilter>('Tous');
  pageSize     = signal(6);
  currentPage  = signal(1);

  pageSizeMenuOpen = signal(false);
  filterMenuOpen   = signal(false);

  pageSizeOptions = [5, 6, 10, 25, 50];
  filterOptions: ActionFilter[] = ['Tous', 'Création entreprise', 'Création restaurant', 'Modification', 'Suppression'];

  filtered = computed(() => {
    const q  = this.searchTerm().toLowerCase();
    const af = this.actionFilter();
    return MOCK_LOGS.filter(l => {
      if (q && !(l.action.toLowerCase().includes(q) || l.user.toLowerCase().includes(q) || l.details.toLowerCase().includes(q))) return false;
      if (af !== 'Tous' && l.action !== af) return false;
      return true;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

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

  logs = computed(() => {
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

  toggleFilterMenu(): void   { this.filterMenuOpen.update(v => !v); }
  togglePageSizeMenu(): void { this.pageSizeMenuOpen.update(v => !v); }

  setFilter(f: ActionFilter): void {
    this.actionFilter.set(f);
    this.currentPage.set(1);
    this.filterMenuOpen.set(false);
  }
}
