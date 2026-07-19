import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DatasetStorageService } from '../../../core/services/dataset-storage.service';
import { MonitoringRepository } from '../application/monitoring.repository';
import { MonitoringTransaction } from '../domain/monitoring-transaction.model';

const STORAGE_KEY = 'jp_monitoring_dataset';
const DEFAULT_TRANSACTIONS: readonly MonitoringTransaction[] = [
  { id: '#1231413', employee: 'Mermoz', company: 'Entreprise 1', restaurant: 'Restaurant 1', amount: '2 000', date: '2026-04-15', status: 'Validé' },
  { id: '#1231414', employee: 'Karak', company: 'Entreprise 2', restaurant: 'Restaurant 2', amount: '3 500', date: '2026-04-15', status: 'Validé' },
  { id: '#1231415', employee: 'Fann', company: 'Entreprise 3', restaurant: 'Restaurant 3', amount: '1 200', date: '2026-04-15', status: 'En attente' },
  { id: '#1231416', employee: 'Keur Gorgui', company: 'Entreprise 4', restaurant: 'Restaurant 4', amount: '4 800', date: '2026-04-14', status: 'Validé' },
  { id: '#1231417', employee: 'Medina', company: 'Entreprise 5', restaurant: 'Restaurant 5', amount: '900', date: '2026-04-14', status: 'Échoué' },
  { id: '#1231418', employee: 'Point E', company: 'Entreprise 6', restaurant: 'Restaurant 6', amount: '2 600', date: '2026-04-13', status: 'Validé' },
  { id: '#1231419', employee: 'Ouakam', company: 'Entreprise 1', restaurant: 'Restaurant 1', amount: '1 800', date: '2026-04-13', status: 'Validé' },
  { id: '#1231420', employee: 'Plateau', company: 'Entreprise 2', restaurant: 'Restaurant 2', amount: '5 000', date: '2026-04-12', status: 'En attente' },
  { id: '#1231421', employee: 'Almadies', company: 'Entreprise 3', restaurant: 'Restaurant 3', amount: '3 200', date: '2026-04-12', status: 'Validé' },
  { id: '#1231422', employee: "N'Gor", company: 'Entreprise 4', restaurant: 'Restaurant 4', amount: '750', date: '2026-04-11', status: 'Échoué' },
];

@Injectable({ providedIn: 'root' })
export class LocalMonitoringRepository implements MonitoringRepository {
  private readonly storage = inject(DatasetStorageService);

  list(): Observable<MonitoringTransaction[]> {
    return of(this.storage.readArray(STORAGE_KEY, [...DEFAULT_TRANSACTIONS]));
  }

  saveAll(transactions: readonly MonitoringTransaction[]): Observable<void> {
    this.storage.writeArray(STORAGE_KEY, transactions);
    return of(undefined);
  }
}
