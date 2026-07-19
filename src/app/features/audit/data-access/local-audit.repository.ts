import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuditRepository } from '../application/audit.repository';
import { AuditLog } from '../domain/audit-log.model';

const AUDIT_LOGS: readonly AuditLog[] = [
  { action: 'Création entreprise', user: 'Admin Principal', details: 'Sonatel SA ajoutée', date: '2026-04-15 10:30' },
  { action: 'Création restaurant', user: 'Admin Principal', details: 'Le Djolof ajouté', date: '2026-04-15 11:00' },
  { action: 'Modification', user: 'Admin Principal', details: 'Orange SN modifiée', date: '2026-04-14 09:15' },
  { action: 'Création entreprise', user: 'Admin Principal', details: 'Ecobank ajoutée', date: '2026-04-14 08:30' },
  { action: 'Création restaurant', user: 'Admin Principal', details: 'La Téranga ajoutée', date: '2026-04-13 14:45' },
  { action: 'Modification', user: 'Admin Principal', details: 'Thiébou Ndar modifié', date: '2026-04-13 13:20' },
  { action: 'Suppression', user: 'Admin Principal', details: 'Restaurant FoodGood supprimé', date: '2026-04-12 16:00' },
  { action: 'Création entreprise', user: 'Admin Principal', details: 'Total SN ajoutée', date: '2026-04-12 10:00' },
  { action: 'Modification', user: 'Admin Principal', details: 'Tigo modifiée', date: '2026-04-11 11:30' },
  { action: 'Création restaurant', user: 'Admin Principal', details: 'Dakar Bistro ajouté', date: '2026-04-11 09:45' },
  { action: 'Création entreprise', user: 'Admin Principal', details: 'CBAO ajoutée', date: '2026-04-10 14:00' },
  { action: 'Suppression', user: 'Admin Principal', details: 'Ancienne entreprise retirée', date: '2026-04-10 08:00' },
];

@Injectable({ providedIn: 'root' })
export class LocalAuditRepository implements AuditRepository {
  list(): Observable<AuditLog[]> {
    return of([...AUDIT_LOGS]);
  }
}
