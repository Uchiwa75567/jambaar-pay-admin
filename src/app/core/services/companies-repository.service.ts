import { Injectable } from '@angular/core';
import { Company } from '../models/company.models';
import { DatasetStorageService } from './dataset-storage.service';

const COMPANIES_STORAGE_KEY = 'jp_companies_dataset';

const DEFAULT_COMPANIES: Company[] = [
  { id: '1', name: 'Sonatel SA', employeeCount: 567, totalBalance: 878_929, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '2', name: 'Orange SN', employeeCount: 342, totalBalance: 450_000, registrationDate: '2026-04-10', status: 'Actif' },
  { id: '3', name: 'Ecobank Sénégal', employeeCount: 210, totalBalance: 320_500, registrationDate: '2026-03-22', status: 'Inactif' },
  { id: '4', name: 'Expresso Télécom', employeeCount: 180, totalBalance: 215_300, registrationDate: '2026-03-15', status: 'Actif' },
  { id: '5', name: 'Total Sénégal', employeeCount: 420, totalBalance: 610_000, registrationDate: '2026-03-01', status: 'Actif' },
  { id: '6', name: 'Tigo SN', employeeCount: 290, totalBalance: 380_750, registrationDate: '2026-02-18', status: 'Inactif' },
  { id: '7', name: 'CBAO', employeeCount: 150, totalBalance: 190_000, registrationDate: '2026-02-05', status: 'Actif' },
  { id: '8', name: 'Société Générale', employeeCount: 320, totalBalance: 500_200, registrationDate: '2026-01-20', status: 'Actif' },
  { id: '9', name: 'Attijariwafa', employeeCount: 275, totalBalance: 430_100, registrationDate: '2026-01-12', status: 'Inactif' },
  { id: '10', name: 'BHS Sénégal', employeeCount: 130, totalBalance: 160_000, registrationDate: '2025-12-10', status: 'Actif' },
  { id: '11', name: 'Orabank SN', employeeCount: 195, totalBalance: 280_400, registrationDate: '2025-11-22', status: 'Actif' },
  { id: '12', name: 'UBA Sénégal', employeeCount: 110, totalBalance: 140_600, registrationDate: '2025-10-15', status: 'Inactif' },
];

@Injectable({ providedIn: 'root' })
export class CompaniesRepositoryService {
  constructor(private readonly datasetStorage: DatasetStorageService) {}

  readAll(): Company[] {
    return this.datasetStorage.readArray(COMPANIES_STORAGE_KEY, DEFAULT_COMPANIES);
  }

  saveAll(companies: Company[]): void {
    this.datasetStorage.writeArray(COMPANIES_STORAGE_KEY, companies);
  }

  upsert(company: Company): void {
    const companiesById = new Map(this.readAll().map(current => [current.id, current]));
    companiesById.set(company.id, company);
    this.saveAll(Array.from(companiesById.values()));
  }
}
