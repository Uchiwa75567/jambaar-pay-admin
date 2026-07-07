import { Component, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { DataTransferService, ExportColumn, ImportedRecord } from '../../core/services/data-transfer.service';
import { DatasetStorageService } from '../../core/services/dataset-storage.service';
import { buildVisiblePages, sliceCurrentPage } from '../../core/utils/pagination';

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
type FeedbackState = { type: 'success' | 'error'; message: string } | null;
const MONITORING_STORAGE_KEY = 'jp_monitoring_dataset';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule, MenuModule, KpiCardComponent, StatusBadgeComponent],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
})
export class MonitoringComponent {
  private readonly allTransactions = signal<MonitoringTransaction[]>([]);

  searchTerm   = signal('');
  statusFilter = signal<StatusFilter>('Tous');
  pageSize     = signal(6);
  currentPage  = signal(1);
  feedback     = signal<FeedbackState>(null);

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
    return this.allTransactions().filter(t => {
      if (q && !(t.employee.toLowerCase().includes(q) || t.company.toLowerCase().includes(q) || t.restaurant.toLowerCase().includes(q))) return false;
      if (sf !== 'Tous' && t.status !== sf) return false;
      return true;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

  visiblePages = computed<(number | '...')[]>(() => {
    return buildVisiblePages(this.totalPages(), this.currentPage());
  });

  transactions = computed(() => {
    return sliceCurrentPage(this.filtered(), this.currentPage(), this.pageSize());
  });

  private readonly exportColumns: ExportColumn<MonitoringTransaction>[] = [
    { header: 'ID', value: transaction => transaction.id },
    { header: 'Salarie', value: transaction => transaction.employee },
    { header: 'Entreprise', value: transaction => transaction.company },
    { header: 'Restaurant', value: transaction => transaction.restaurant },
    { header: 'Montant', value: transaction => transaction.amount },
    { header: 'Date', value: transaction => transaction.date },
    { header: 'Statut', value: transaction => transaction.status },
  ];

  constructor(
    private el: ElementRef,
    private dataTransfer: DataTransferService,
    private datasetStorage: DatasetStorageService,
  ) {
    this.allTransactions.set(this.datasetStorage.readArray(MONITORING_STORAGE_KEY, MOCK_TRANSACTIONS));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) {
      this.pageSizeMenuOpen.set(false);
      this.filterMenuOpen.set(false);
      this.exportMenuOpen.set(false);
    }
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
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

  async onImportFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const records = await this.dataTransfer.readRecords(file);
      const imported = records
        .map((record, index) => this.mapImportedTransaction(record, index))
        .filter((transaction): transaction is MonitoringTransaction => transaction !== null);

      if (!imported.length) {
        throw new Error('Aucune transaction exploitable n’a ete trouvee dans le fichier.');
      }

      const merged = this.mergeById(this.allTransactions(), imported);
      this.persistTransactions(merged);
      this.currentPage.set(1);
      this.setFeedback('success', `${imported.length} transaction(s) importee(s) avec succes.`);
    } catch (error) {
      this.setFeedback('error', error instanceof Error ? error.message : 'Import impossible.');
    } finally {
      input.value = '';
    }
  }

  exportPDF(): void {
    try {
      this.dataTransfer.exportPdf('Transactions de monitoring', this.filtered(), this.exportColumns);
      this.setFeedback('success', 'Vue PDF ouverte pour les transactions.');
    } catch (error) {
      this.setFeedback('error', error instanceof Error ? error.message : 'Export PDF impossible.');
    } finally {
      this.exportMenuOpen.set(false);
    }
  }

  exportExcel(): void {
    this.dataTransfer.exportCsv('transactions-monitoring-jambaarpay', this.filtered(), this.exportColumns);
    this.exportMenuOpen.set(false);
    this.setFeedback('success', 'Export Excel prepare pour les transactions.');
  }

  private mapImportedTransaction(record: ImportedRecord, index: number): MonitoringTransaction | null {
    const employee = this.dataTransfer.getValue(record, ['employee', 'salarie', 'salarie']);
    const company = this.dataTransfer.getValue(record, ['company', 'entreprise']);
    const restaurant = this.dataTransfer.getValue(record, ['restaurant']);

    if (!employee || !company || !restaurant) {
      return null;
    }

    const status = this.normalizeStatus(this.dataTransfer.getValue(record, ['status', 'statut']));

    return {
      id: this.dataTransfer.getValue(record, ['id', 'identifiant']) || `import-transaction-${Date.now()}-${index}`,
      employee,
      company,
      restaurant,
      amount: this.dataTransfer.getValue(record, ['amount', 'montant']) || '0',
      date: this.dataTransfer.getValue(record, ['date']) || new Date().toISOString().slice(0, 10),
      status,
    };
  }

  private normalizeStatus(value: string): MonitoringTransaction['status'] {
    const normalized = value.trim().toLowerCase();
    if (normalized.startsWith('ec') || normalized.startsWith('ech')) {
      return 'Échoué';
    }
    if (normalized.startsWith('en')) {
      return 'En attente';
    }
    return 'Validé';
  }

  private mergeById(current: MonitoringTransaction[], imported: MonitoringTransaction[]): MonitoringTransaction[] {
    const map = new Map(current.map(transaction => [transaction.id, transaction]));
    imported.forEach(transaction => map.set(transaction.id, transaction));
    return Array.from(map.values());
  }

  private persistTransactions(transactions: MonitoringTransaction[]): void {
    this.allTransactions.set(transactions);
    this.datasetStorage.writeArray(MONITORING_STORAGE_KEY, transactions);
  }

  private setFeedback(type: 'success' | 'error', message: string): void {
    this.feedback.set({ type, message });
  }
}
