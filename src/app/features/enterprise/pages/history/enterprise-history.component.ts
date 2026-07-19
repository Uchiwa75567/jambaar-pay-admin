import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';

import { TableModule } from 'primeng/table';
import { EmptyStateComponent } from '../../../../design-system/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../design-system/components/pagination/pagination.component';
import { DataTransferService, ExportColumn } from '../../../../core/services/data-transfer.service';
import { sliceCurrentPage } from '../../../../core/utils/pagination';

interface HistoryTransaction {
  employee: string;
  restaurant: string;
  amount: string;
  date: string;
  status: 'Validé';
}

@Component({
    selector: 'app-enterprise-history',
    imports: [TableModule, EmptyStateComponent, PaginationComponent],
    templateUrl: './enterprise-history.component.html',
    styleUrls: ['./enterprise-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterpriseHistoryComponent {
  private readonly dataTransfer = inject(DataTransferService);

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
  readonly pageSizeOptions = [5, 10];
  private readonly exportColumns: ExportColumn<HistoryTransaction>[] = [
    { header: 'Salarie', value: transaction => transaction.employee },
    { header: 'Restaurant', value: transaction => transaction.restaurant },
    { header: 'Montant', value: transaction => transaction.amount },
    { header: 'Date', value: transaction => transaction.date },
    { header: 'Statut', value: transaction => transaction.status },
  ];

  totalPages = computed(() => Math.max(1, Math.ceil(this.transactions.length / this.pageSize())));

  paginatedTransactions = computed(() => {
    return sliceCurrentPage(this.transactions, this.currentPage(), this.pageSize());
  });

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  exportExcel(): void {
    this.dataTransfer.exportCsv('historique-entreprise-jambaarpay', this.transactions, this.exportColumns);
  }

  exportPdf(): void {
    this.dataTransfer.exportPdf('Historique des transactions', this.transactions, this.exportColumns);
  }
}
