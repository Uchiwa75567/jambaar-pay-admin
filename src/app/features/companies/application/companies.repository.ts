import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../domain/company.model';

export interface CompaniesRepository {
  list(): Observable<Company[]>;
  saveAll(companies: readonly Company[]): Observable<void>;
  upsert(company: Company): Observable<Company>;
}

export const COMPANIES_REPOSITORY = new InjectionToken<CompaniesRepository>('COMPANIES_REPOSITORY');
