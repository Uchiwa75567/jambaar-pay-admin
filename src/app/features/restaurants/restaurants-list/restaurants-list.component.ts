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
import { Restaurant } from '../../../core/models/restaurant.models';

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: '1',  name: 'Restaurant Le Djolof', address: 'Mermoz',      totalTransactions: 123, totalVolume: 892_998, registrationDate: '2026-04-15', status: 'Actif'   },
  { id: '2',  name: 'Le Plat',              address: 'Karak',        totalTransactions:  98, totalVolume: 450_000, registrationDate: '2026-04-10', status: 'Actif'   },
  { id: '3',  name: 'La Téranga',           address: 'Fann',         totalTransactions:  75, totalVolume: 320_500, registrationDate: '2026-03-22', status: 'Inactif' },
  { id: '4',  name: 'Thiébou Ndar',         address: 'Keur Gorgui',  totalTransactions:  60, totalVolume: 215_300, registrationDate: '2026-03-15', status: 'Actif'   },
  { id: '5',  name: 'FoodGood',             address: 'Medina',       totalTransactions: 112, totalVolume: 610_000, registrationDate: '2026-03-01', status: 'Actif'   },
  { id: '6',  name: 'Dakar Bistro',         address: 'Point E',      totalTransactions:  44, totalVolume: 180_750, registrationDate: '2026-02-18', status: 'Inactif' },
  { id: '7',  name: 'Chez Lamine',          address: 'Ouakam',       totalTransactions:  87, totalVolume: 390_000, registrationDate: '2026-02-05', status: 'Actif'   },
  { id: '8',  name: 'Saveur d\'Afrique',    address: 'Plateau',      totalTransactions:  55, totalVolume: 200_200, registrationDate: '2026-01-20', status: 'Actif'   },
  { id: '9',  name: 'Terranga Palace',      address: 'Almadies',     totalTransactions:  32, totalVolume: 130_100, registrationDate: '2026-01-12', status: 'Inactif' },
  { id: '10', name: 'N\'Gor Beach',          address: 'N\'Gor',       totalTransactions:  70, totalVolume: 160_000, registrationDate: '2025-12-10', status: 'Actif'   },
];

type StatusFilter = 'Tous' | 'Actif' | 'Inactif';

@Component({
  selector: 'app-restaurants-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, InputTextModule, MenuModule, StatusBadgeComponent],
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss'],
})
export class RestaurantsListComponent {
  searchTerm   = signal('');
  statusFilter = signal<StatusFilter>('Tous');
  pageSize     = signal(6);
  currentPage  = signal(1);

  pageSizeMenuOpen = signal(false);
  filterMenuOpen   = signal(false);

  pageSizeOptions = [6, 12, 18];
  filterOptions: StatusFilter[] = ['Tous', 'Actif', 'Inactif'];

  filtered = computed(() => {
    const q  = this.searchTerm().toLowerCase();
    const sf = this.statusFilter();
    return MOCK_RESTAURANTS.filter(r => {
      if (q && !r.name.toLowerCase().includes(q)) return false;
      if (sf !== 'Tous' && r.status !== sf) return false;
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

  restaurants = computed(() => {
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

  setFilter(f: StatusFilter): void {
    this.statusFilter.set(f);
    this.currentPage.set(1);
    this.filterMenuOpen.set(false);
  }

  toggleFilterMenu(): void   { this.filterMenuOpen.update(v => !v); }
  togglePageSizeMenu(): void { this.pageSizeMenuOpen.update(v => !v); }

  getMenuItems(restaurant: Restaurant): MenuItem[] {
    return [
      { label: 'Voir détails', icon: 'pi pi-eye'    },
      { label: 'Modifier',     icon: 'pi pi-pencil' },
      { label: 'Désactiver',   icon: 'pi pi-ban',   styleClass: 'text-red-500' },
    ];
  }
}
