import { Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

interface HistoryTransaction {
  employee: string;
  restaurant: string;
  amount: string;
  date: string;
  status: 'Validé';
}

@Component({
  selector: 'app-enterprise-history',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './enterprise-history.component.html',
  styleUrls: ['./enterprise-history.component.scss'],
})
export class EnterpriseHistoryComponent {
  private readonly restaurants = [
    'Restaurant Le Djolof',
    'La Téranga',
    'Dakar Bistro',
    'Le Plat',
    'Chez Lamine',
    'Saveur d’Afrique',
  ];

  transactions: HistoryTransaction[] = Array.from({ length: 24 }, (_, index) => ({
    employee: `#${38932987 + index}`,
    restaurant: this.restaurants[index % this.restaurants.length],
    amount: `${new Intl.NumberFormat('fr-FR').format(2_000 + (index % 8) * 500)} Fcfa`,
    date: `2026-04-${String(15 - (index % 15)).padStart(2, '0')}`,
    status: 'Validé',
  }));

  pageSize = signal(5);
  currentPage = signal(1);
  pageSizeMenuOpen = signal(false);
  readonly pageSizeOptions = [5, 10];

  totalPages = computed(() => Math.max(1, Math.ceil(this.transactions.length / this.pageSize())));

  visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 6) return Array.from({ length: total }, (_, index) => index + 1);
    if (current <= 3) return [1, 2, 3, '...', total];
    if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  });

  paginatedTransactions = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.transactions.slice(start, start + this.pageSize());
  });

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.pageSizeMenuOpen.set(false);
    }
  }

  togglePageSizeMenu(): void {
    this.pageSizeMenuOpen.update(open => !open);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.pageSizeMenuOpen.set(false);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }
}
