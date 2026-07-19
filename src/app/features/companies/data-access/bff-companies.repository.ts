import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BffApiClient } from '../../../core/http/bff-api.client';
import { CompaniesRepository } from '../application/companies.repository';
import { Company } from '../domain/company.model';

interface CompanyDto {
  id: string;
  name: string;
  employeeCount: number;
  totalBalance: number;
  registrationDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

@Injectable({ providedIn: 'root' })
export class BffCompaniesRepository implements CompaniesRepository {
  private readonly api = inject(BffApiClient);

  list(): Observable<Company[]> {
    return this.api.get<CompanyDto[]>('companies').pipe(
      map(companies => companies.map(company => this.toDomain(company))),
    );
  }

  saveAll(companies: readonly Company[]): Observable<void> {
    return this.api.put<void, CompanyDto[]>('companies/bulk', companies.map(company => this.toDto(company)));
  }

  upsert(company: Company): Observable<Company> {
    return this.api.put<CompanyDto, CompanyDto>(`companies/${encodeURIComponent(company.id)}`, this.toDto(company)).pipe(
      map(response => this.toDomain(response)),
    );
  }

  private toDomain(dto: CompanyDto): Company {
    return {
      id: dto.id,
      name: dto.name,
      employeeCount: dto.employeeCount,
      totalBalance: dto.totalBalance,
      registrationDate: dto.registrationDate,
      status: dto.status === 'ACTIVE' ? 'Actif' : 'Inactif',
    };
  }

  private toDto(company: Company): CompanyDto {
    return {
      ...company,
      status: company.status === 'Actif' ? 'ACTIVE' : 'INACTIVE',
    };
  }
}
