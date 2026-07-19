import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, signal, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { EmptyStateComponent } from '../../../../design-system/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../design-system/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../../design-system/components/status-badge/status-badge.component';
import { DataTransferService, ExportColumn } from '../../../../core/services/data-transfer.service';
import { sliceCurrentPage } from '../../../../core/utils/pagination';
import { RestaurantPaymentRecord, RestaurantPaymentsFacade } from '../../application/restaurant-payments.facade';

type RestaurantHistoryStatus = 'Tous' | 'Validé' | 'En attente' | 'Échoué';

@Component({
    selector: 'app-restaurant-history',
    imports: [FormsModule, InputTextModule, TableModule, EmptyStateComponent, PaginationComponent, StatusBadgeComponent],
    templateUrl: './restaurant-history.component.html',
    styleUrls: ['./restaurant-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantHistoryComponent {
  private readonly el = inject(ElementRef);
  private readonly dataTransfer = inject(DataTransferService);
  private readonly restaurantPayments = inject(RestaurantPaymentsFacade);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<RestaurantHistoryStatus>('Tous');
  readonly pageSize = signal(6);
  readonly currentPage = signal(1);
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
  readonly paginatedPayments = computed(() => sliceCurrentPage(this.filteredPayments(), this.currentPage(), this.pageSize()));

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
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

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  setPage(page: number | '...'): void {
    if (page === '...' || page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
  }

  exportExcel(): void {
    this.dataTransfer.exportCsv('historique-paiements-restaurant', this.filteredPayments(), this.exportColumns);
  }

  exportPdf(): void {
    this.dataTransfer.exportPdf('Historique des paiements restaurant', this.filteredPayments(), this.exportColumns);
  }
}
