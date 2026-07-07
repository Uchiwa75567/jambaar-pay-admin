import { Injectable, computed, signal } from '@angular/core';
import { Company } from '../../../core/models/company.models';
import { DataTransferService, ExportColumn, ImportedRecord } from '../../../core/services/data-transfer.service';
import { DatasetStorageService } from '../../../core/services/dataset-storage.service';

export type CompanyStatusFilter = 'Tous' | 'Actif' | 'Inactif';
export type CompanyDateFilter = 'Tous' | 'Ce mois' | 'Ce trimestre' | 'Cette année';
export type CompanyFeedbackState = { type: 'success' | 'error'; message: string } | null;

const COMPANIES_STORAGE_KEY = 'jp_companies_dataset';
const DEFAULT_PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10];
const STATUS_OPTIONS: CompanyStatusFilter[] = ['Tous', 'Actif', 'Inactif'];
const DATE_OPTIONS: CompanyDateFilter[] = ['Tous', 'Ce mois', 'Ce trimestre', 'Cette année'];

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Sonatel SA', employeeCount: 567, totalBalance: 878_929, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '2', name: 'Orange SN', employeeCount: 342, totalBalance: 450_000, registrationDate: '2026-04-10', status: 'Actif' },
  { id: '3', name: 'Ecobank Sénégal', employeeCount: 210, totalBalance: 320_500, registrationDate: '2026-03-22', status: 'Inactif' },
  { id: '4', name: 'Expresso Télécom', employeeCount: 180, totalBalance: 215_300, registrationDate: '2026-03-15', status: 'Actif' },
  { id: '5', name: 'Total Sénégal', employeeCount: 420, totalBalance: 610_000, registrationDate: '2026-03-01', status: 'Actif' },
  { id: '6', name: 'Tigo SN', employeeCount: 290, totalBalance: 380_750, registrationDate: '2026-02-18', status: 'Inactif' },
  { id: '7', name: 'CBAO', employeeCount: 150, totalBalance: 190_000, registrationDate: '2026-02-05', status: 'Actif' },
  { id: '8', name: 'Société Générale', employeeCount: 320, totalBalance: 500_200, registrationDate: '2026-01-20', status: 'Actif' },
  { id: '9', name: 'Attijariwafa', employeeCount: 275, totalBalance: 430_100, registrationDate: '2026-01-12', status: 'Inactif' },
  { id: '10', name: 'BHS Sénégal', employeeCount: 130, totalBalance: 160_000, registrationDate: '2025-12-10', status: 'Actif' },
  { id: '11', name: 'Orabank SN', employeeCount: 195, totalBalance: 280_400, registrationDate: '2025-11-22', status: 'Actif' },
  { id: '12', name: 'UBA Sénégal', employeeCount: 110, totalBalance: 140_600, registrationDate: '2025-10-15', status: 'Inactif' },
];

@Injectable()
export class CompaniesListFacade {
  private readonly allCompanies = signal<Company[]>([]);
  private readonly exportColumns: ExportColumn<Company>[] = [
    { header: 'ID', value: company => company.id },
    { header: 'Entreprise', value: company => company.name },
    { header: 'Salaries', value: company => company.employeeCount },
    { header: 'Solde total', value: company => company.totalBalance },
    { header: 'Date inscription', value: company => company.registrationDate },
    { header: 'Statut', value: company => company.status },
  ];

  readonly searchTerm = signal('');
  readonly statusFilter = signal<CompanyStatusFilter>('Tous');
  readonly dateFilter = signal<CompanyDateFilter>('Tous');
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);
  readonly currentPage = signal(1);
  readonly feedback = signal<CompanyFeedbackState>(null);

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;
  readonly dateOptions = DATE_OPTIONS;

  readonly filterLabel = computed(() => {
    const status = this.statusFilter();
    const date = this.dateFilter();

    if (status !== 'Tous') {
      return status;
    }

    if (date !== 'Tous') {
      return date;
    }

    return 'Tous';
  });

  readonly filteredCompanies = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const date = this.dateFilter();

    return this.allCompanies().filter(company => {
      if (query && !company.name.toLowerCase().includes(query)) {
        return false;
      }

      if (status !== 'Tous' && company.status !== status) {
        return false;
      }

      return this.isInDateRange(company.registrationDate, date);
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredCompanies().length / this.pageSize())));

  readonly visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 6) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, '...', total];
    }

    if (current >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  });

  readonly companies = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredCompanies().slice(start, start + this.pageSize());
  });

  constructor(
    private readonly dataTransfer: DataTransferService,
    private readonly datasetStorage: DatasetStorageService
  ) {
    this.allCompanies.set(this.datasetStorage.readArray(COMPANIES_STORAGE_KEY, MOCK_COMPANIES));
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
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

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  setStatusFilter(status: CompanyStatusFilter): void {
    this.statusFilter.set(status);
    this.dateFilter.set('Tous');
    this.currentPage.set(1);
  }

  setDateFilter(date: CompanyDateFilter): void {
    this.dateFilter.set(date);
    this.statusFilter.set('Tous');
    this.currentPage.set(1);
  }

  async importCompanies(file: File): Promise<void> {
    const records = await this.dataTransfer.readRecords(file);
    const importedCompanies = records
      .map((record, index) => this.mapImportedCompany(record, index))
      .filter((company): company is Company => company !== null);

    if (!importedCompanies.length) {
      throw new Error('Aucune ligne entreprise exploitable n’a ete trouvee dans le fichier.');
    }

    const mergedCompanies = this.mergeById(this.allCompanies(), importedCompanies);
    this.persistCompanies(mergedCompanies);
    this.currentPage.set(1);
    this.setFeedback('success', `${importedCompanies.length} entreprise(s) importee(s) avec succes.`);
  }

  exportExcel(): void {
    this.dataTransfer.exportCsv('entreprises-jambaarpay', this.filteredCompanies(), this.exportColumns);
    this.setFeedback('success', 'Export Excel prepare pour la liste des entreprises.');
  }

  exportPdf(): void {
    this.dataTransfer.exportPdf('Liste des entreprises', this.filteredCompanies(), this.exportColumns);
    this.setFeedback('success', 'Vue PDF ouverte pour la liste des entreprises.');
  }

  setErrorFeedback(error: unknown, fallbackMessage: string): void {
    this.setFeedback('error', error instanceof Error ? error.message : fallbackMessage);
  }

  private isInDateRange(dateValue: string, range: CompanyDateFilter): boolean {
    if (range === 'Tous') {
      return true;
    }

    const date = new Date(dateValue);
    const now = new Date();

    if (range === 'Ce mois') {
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }

    if (range === 'Ce trimestre') {
      return date.getFullYear() === now.getFullYear()
        && Math.floor(date.getMonth() / 3) === Math.floor(now.getMonth() / 3);
    }

    if (range === 'Cette année') {
      return date.getFullYear() === now.getFullYear();
    }

    return true;
  }

  private mapImportedCompany(record: ImportedRecord, index: number): Company | null {
    const name = this.dataTransfer.getValue(record, ['name', 'entreprise', 'societe', 'company']);

    if (!name) {
      return null;
    }

    const status = this.normalizeStatus(this.dataTransfer.getValue(record, ['status', 'statut']));
    const employeeCount = this.toNumber(this.dataTransfer.getValue(record, ['employeecount', 'salaries', 'employees', 'effectif']));
    const totalBalance = this.toNumber(this.dataTransfer.getValue(record, ['totalbalance', 'soldetotal', 'balance', 'solde']));
    const registrationDate = this.dataTransfer.getValue(record, ['registrationdate', 'dateinscription', 'date', 'createdat'])
      || new Date().toISOString().slice(0, 10);
    const id = this.dataTransfer.getValue(record, ['id', 'identifiant']) || `import-company-${Date.now()}-${index}`;

    return {
      id,
      name,
      employeeCount,
      totalBalance,
      registrationDate,
      status,
    };
  }

  private normalizeStatus(value: string): Company['status'] {
    return value.trim().toLowerCase().startsWith('in') ? 'Inactif' : 'Actif';
  }

  private toNumber(value: string): number {
    const normalized = value.replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private mergeById(currentCompanies: Company[], importedCompanies: Company[]): Company[] {
    const companiesById = new Map(currentCompanies.map(company => [company.id, company]));
    importedCompanies.forEach(company => companiesById.set(company.id, company));
    return Array.from(companiesById.values());
  }

  private persistCompanies(companies: Company[]): void {
    this.allCompanies.set(companies);
    this.datasetStorage.writeArray(COMPANIES_STORAGE_KEY, companies);
  }

  private setFeedback(type: 'success' | 'error', message: string): void {
    this.feedback.set({ type, message });
  }
}
