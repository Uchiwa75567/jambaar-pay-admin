import { Injectable, computed, signal } from '@angular/core';
import { Restaurant } from '../../../core/models/restaurant.models';
import { DataTransferService, ExportColumn, ImportedRecord } from '../../../core/services/data-transfer.service';
import { RestaurantsRepositoryService } from '../../../core/services/restaurants-repository.service';
import { buildVisiblePages, sliceCurrentPage } from '../../../core/utils/pagination';

export type RestaurantStatusFilter = 'Tous' | 'Actif' | 'Inactif';
export type RestaurantFeedbackState = { type: 'success' | 'error'; message: string } | null;

const DEFAULT_PAGE_SIZE = 6;
const PAGE_SIZE_OPTIONS = [6, 12, 18];
const FILTER_OPTIONS: RestaurantStatusFilter[] = ['Tous', 'Actif', 'Inactif'];

@Injectable()
export class RestaurantsListFacade {
  private readonly allRestaurants = signal<Restaurant[]>([]);
  private readonly exportColumns: ExportColumn<Restaurant>[] = [
    { header: 'ID', value: restaurant => restaurant.id },
    { header: 'Restaurant', value: restaurant => restaurant.name },
    { header: 'Adresse', value: restaurant => restaurant.address },
    { header: 'Telephone', value: restaurant => restaurant.phone ?? '' },
    { header: 'Transactions', value: restaurant => restaurant.totalTransactions },
    { header: 'Volume total', value: restaurant => restaurant.totalVolume },
    { header: 'Date inscription', value: restaurant => restaurant.registrationDate },
    { header: 'Statut', value: restaurant => restaurant.status },
  ];

  readonly searchTerm = signal('');
  readonly statusFilter = signal<RestaurantStatusFilter>('Tous');
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);
  readonly currentPage = signal(1);
  readonly feedback = signal<RestaurantFeedbackState>(null);

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly filterOptions = FILTER_OPTIONS;

  readonly filteredRestaurants = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.allRestaurants().filter(restaurant => {
      if (query && !restaurant.name.toLowerCase().includes(query)) {
        return false;
      }

      if (status !== 'Tous' && restaurant.status !== status) {
        return false;
      }

      return true;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredRestaurants().length / this.pageSize())));

  readonly visiblePages = computed<(number | '...')[]>(() => {
    return buildVisiblePages(this.totalPages(), this.currentPage());
  });

  readonly restaurants = computed(() => {
    return sliceCurrentPage(this.filteredRestaurants(), this.currentPage(), this.pageSize());
  });

  constructor(
    private readonly dataTransfer: DataTransferService,
    private readonly restaurantsRepository: RestaurantsRepositoryService,
  ) {
    this.allRestaurants.set(this.restaurantsRepository.readAll());
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
      this.currentPage.update(currentPage => currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(currentPage => currentPage + 1);
    }
  }

  setFilter(status: RestaurantStatusFilter): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  async importRestaurants(file: File): Promise<void> {
    const records = await this.dataTransfer.readRecords(file);
    const importedRestaurants = records
      .map((record, index) => this.mapImportedRestaurant(record, index))
      .filter((restaurant): restaurant is Restaurant => restaurant !== null);

    if (!importedRestaurants.length) {
      throw new Error('Aucune ligne restaurant exploitable n’a ete trouvee dans le fichier.');
    }

    const mergedRestaurants = this.mergeById(this.allRestaurants(), importedRestaurants);
    this.persistRestaurants(mergedRestaurants);
    this.currentPage.set(1);
    this.setFeedback('success', `${importedRestaurants.length} restaurant(s) importe(s) avec succes.`);
  }

  exportExcel(): void {
    this.dataTransfer.exportCsv('restaurants-jambaarpay', this.filteredRestaurants(), this.exportColumns);
    this.setFeedback('success', 'Export Excel prepare pour la liste des restaurants.');
  }

  exportPdf(): void {
    this.dataTransfer.exportPdf('Liste des restaurants', this.filteredRestaurants(), this.exportColumns);
    this.setFeedback('success', 'Vue PDF ouverte pour la liste des restaurants.');
  }

  setErrorFeedback(error: unknown, fallbackMessage: string): void {
    this.setFeedback('error', error instanceof Error ? error.message : fallbackMessage);
  }

  private mapImportedRestaurant(record: ImportedRecord, index: number): Restaurant | null {
    const name = this.dataTransfer.getValue(record, ['name', 'restaurant']);

    if (!name) {
      return null;
    }

    const id = this.dataTransfer.getValue(record, ['id', 'identifiant']) || `import-restaurant-${Date.now()}-${index}`;
    const address = this.dataTransfer.getValue(record, ['address', 'adresse', 'localisation']) || 'Non renseignee';
    const phone = this.dataTransfer.getValue(record, ['phone', 'telephone']);
    const totalTransactions = this.toNumber(this.dataTransfer.getValue(record, ['totaltransactions', 'transactions', 'nombretransactions']));
    const totalVolume = this.toNumber(this.dataTransfer.getValue(record, ['totalvolume', 'volume', 'volumetotal']));
    const registrationDate = this.dataTransfer.getValue(record, ['registrationdate', 'dateinscription', 'date', 'createdat'])
      || new Date().toISOString().slice(0, 10);
    const status = this.normalizeStatus(this.dataTransfer.getValue(record, ['status', 'statut']));

    return {
      id,
      name,
      address,
      phone: phone || undefined,
      totalTransactions,
      totalVolume,
      registrationDate,
      status,
    };
  }

  private normalizeStatus(value: string): Restaurant['status'] {
    return value.trim().toLowerCase().startsWith('in') ? 'Inactif' : 'Actif';
  }

  private toNumber(value: string): number {
    const normalized = value.replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private mergeById(currentRestaurants: Restaurant[], importedRestaurants: Restaurant[]): Restaurant[] {
    const restaurantsById = new Map(currentRestaurants.map(restaurant => [restaurant.id, restaurant]));
    importedRestaurants.forEach(restaurant => restaurantsById.set(restaurant.id, restaurant));
    return Array.from(restaurantsById.values());
  }

  private persistRestaurants(restaurants: Restaurant[]): void {
    this.allRestaurants.set(restaurants);
    this.restaurantsRepository.saveAll(restaurants);
  }

  private setFeedback(type: 'success' | 'error', message: string): void {
    this.feedback.set({ type, message });
  }
}
