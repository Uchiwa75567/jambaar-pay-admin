import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { MonitoringTransaction } from '../domain/monitoring-transaction.model';

export interface MonitoringRepository {
  list(): Observable<MonitoringTransaction[]>;
  saveAll(transactions: readonly MonitoringTransaction[]): Observable<void>;
}

export const MONITORING_REPOSITORY = new InjectionToken<MonitoringRepository>('MONITORING_REPOSITORY');
