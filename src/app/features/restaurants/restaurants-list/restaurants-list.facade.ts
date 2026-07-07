import { Injectable, computed, signal } from '@angular/core';
import { Restaurant } from '../../../core/models/restaurant.models';
import { DataTransferService, ExportColumn, ImportedRecord } from '../../../core/services/data-transfer.service';
import { DatasetStorageService } from '../../../core/services/dataset-storage.service';

export type RestaurantStatusFilter = 'Tous' | 'Actif' | 'Inactif';
export type RestaurantFeedbackState = { type: 'success' | 'error'; message: string } | null;

const RESTAURANTS_STORAGE_KEY = 'jp_restaurants_dataset';
const DEFAULT_PAGE_SIZE = 6;
const PAGE_SIZE_OPTIONS = [6, 12, 18];
const FILTER_OPTIONS: RestaurantStatusFilter[] = ['Tous', 'Actif', 'Inactif'];

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Restaurant Le Djolof', address: 'Mermoz', totalTransactions: 123, totalVolume: 892_998, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '2', name: 'Le Plat', address: 'Karak', totalTransactions: 98, totalVolume: 450_000, registrationDate: '2026-04-10', status: 'Actif' },
  { id: '3', name: 'La Téranga', address: 'Fann', totalTransactions: 75, totalVolume: 320_500, registrationDate: '2026-03-22', status: 'Inactif' },
  { id: '4', name: 'Thiébou Ndar', address: 'Keur Gorgui', totalTransactions: 60, totalVolume: 215_300, registrationDate: '2026-03-15', status: 'Actif' },
  { id: '5', name: 'FoodGood', address: 'Medina', totalTransactions: 112, totalVolume: 610_000, registrationDate: '2026-03-01', status: 'Actif' },
  { id: '6', name: 'Dakar Bistro', address: 'Point E', totalTransactions: 44, totalVolume: 180_750, registrationDate: '2026-02-18', status: 'Inactif' },
  { id: '7', name: 'Chez Lamine', address: 'Ouakam', totalTransactions: 87, totalVolume: 390_000, registrationDate: '2026-02-05', status: 'Actif' },
  { id: '8', name: "Saveur d'Afrique", address: 'Plateau', totalTransactions: 55, totalVolume: 200_200, registrationDate: '2026-01-20', status: 'Actif' },
  { id: '9', name: 'Terranga Palace', address: 'Almadies', totalTransactions: 32, totalVolume: 130_100, registrationDate: '2026-01-12', status: 'Inactif' },
  { id: '10', name: "N'Gor Beach", address: "N'Gor", totalTransactions: 70, totalVolume: 160_000, registrationDate: '2025-12-10', status: 'Actif' },
];

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

  readonly restaurants = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredRestaurants().slice(start, start + this.pageSize());
  });

  constructor(
    private readonly dataTransfer: DataTransferService,
    private readonly datasetStorage: DatasetStorageService
  ) {
    this.allRestaurants.set(this.datasetStorage.readArray(RESTAURANTS_STORAGE_KEY, MOCK_RESTAURANTS));
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
    this.datasetStorage.writeArray(RESTAURANTS_STORAGE_KEY, restaurants);
  }

  private setFeedback(type: 'success' | 'error', message: string): void {
    this.feedback.set({ type, message });
  }
}
