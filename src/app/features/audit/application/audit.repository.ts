import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditLog } from '../domain/audit-log.model';

export interface AuditRepository {
  list(): Observable<AuditLog[]>;
}

export const AUDIT_REPOSITORY = new InjectionToken<AuditRepository>('AUDIT_REPOSITORY');
