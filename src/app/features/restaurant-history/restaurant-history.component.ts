import { Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { DataTransferService, ExportColumn } from '../../core/services/data-transfer.service';
import { buildVisiblePages, sliceCurrentPage } from '../../core/utils/pagination';
import { RestaurantPaymentRecord, RestaurantPaymentsService } from '../../core/services/restaurant-payments.service';

type RestaurantHistoryStatus = 'Tous' | 'Validé' | 'En attente' | 'Échoué';

@Component({
  selector: 'app-restaurant-history',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, TableModule, StatusBadgeComponent],
  templateUrl: './restaurant-history.component.html',
  styleUrls: ['./restaurant-history.component.scss'],
})
export class RestaurantHistoryComponent {
  readonly searchTerm = signal('');
  readonly statusFilter = signal<RestaurantHistoryStatus>('Tous');
  readonly pageSize = signal(6);
  readonly currentPage = signal(1);
  readonly pageSizeMenuOpen = signal(false);
  readonly filterMenuOpen = signal(false);

  readonly pageSizeOptions = [6, 12, 18];
  readonly statusOptions: RestaurantHistoryStatus[] = ['Tous', 'Validé', 'En attente', 'Échoué'];

  readonly payments = this.restaurantPayments.payments;

  readonly exportColumns: ExportColumn<RestaurantPaymentRecord>[] = [
    { header: 'Reference', value: payment => payment.reference },
    { header: 'Telephone', value: payment => payment.customerPhone },
    { header: 'Entreprise', value: payment => payment.company },
    { header: 'Table', value: payment => payment.table },
    { header: 'Montant', value: payment => payment.amountLabel },
    { header: 'Date', value: payment => payment.date },
    { header: 'Statut', value: payment => payment.status },
  ];

  readonly filteredPayments = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.payments().filter(payment => {
      const matchesQuery = !query || [
        payment.reference,
        payment.customerPhone,
        payment.company,
        payment.table,
      ].some(value => value.toLowerCase().includes(query));

      const matchesStatus = status === 'Tous' || payment.status === status;
      return matchesQuery && matchesStatus;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredPayments().length / this.pageSize())));
  readonly visiblePages = computed<(number | '...')[]>(() => buildVisiblePages(this.totalPages(), this.currentPage()));
  readonly paginatedPayments = computed(() => sliceCurrentPage(this.filteredPayments(), this.currentPage(), this.pageSize()));

  constructor(
    private readonly el: ElementRef,
    private readonly dataTransfer: DataTransferService,
    private readonly restaurantPayments: RestaurantPaymentsService,
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.pageSizeMenuOpen.set(false);
      this.filterMenuOpen.set(false);
    }
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  toggleFilterMenu(): void {
    this.filterMenuOpen.update(isOpen => !isOpen);
  }

  setStatusFilter(status: RestaurantHistoryStatus): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.filterMenuOpen.set(false);
  }

  togglePageSizeMenu(): void {
    this.pageSizeMenuOpen.update(isOpen => !isOpen);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.pageSizeMenuOpen.set(false);
  }

  setPage(page: number | '...'): void {
    if (page === '...' || page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
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

  exportExcel(): void {
    this.dataTransfer.exportCsv('historique-paiements-restaurant', this.filteredPayments(), this.exportColumns);
  }

  exportPdf(): void {
    this.dataTransfer.exportPdf('Historique des paiements restaurant', this.filteredPayments(), this.exportColumns);
  }
}
