import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BffApiClient } from '../../../core/http/bff-api.client';
import { AuditRepository } from '../application/audit.repository';
import { AuditLog } from '../domain/audit-log.model';

@Injectable({ providedIn: 'root' })
export class BffAuditRepository implements AuditRepository {
  private readonly api = inject(BffApiClient);

  list(): Observable<AuditLog[]> {
    return this.api.get<AuditLog[]>('audit/logs');
  }
}
