import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BffApiClient } from '../../../core/http/bff-api.client';
import { MonitoringRepository } from '../application/monitoring.repository';
import { MonitoringTransaction } from '../domain/monitoring-transaction.model';

@Injectable({ providedIn: 'root' })
export class BffMonitoringRepository implements MonitoringRepository {
  private readonly api = inject(BffApiClient);

  list(): Observable<MonitoringTransaction[]> {
    return this.api.get<MonitoringTransaction[]>('monitoring/transactions');
  }

  saveAll(transactions: readonly MonitoringTransaction[]): Observable<void> {
    return this.api.put<void, readonly MonitoringTransaction[]>('monitoring/transactions/import', transactions);
  }
}
