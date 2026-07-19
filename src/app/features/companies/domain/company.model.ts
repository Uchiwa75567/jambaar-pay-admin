export interface Company {
  id: string;
  name: string;
  employeeCount: number;
  totalBalance: number;
  registrationDate: string;
  status: 'Actif' | 'Inactif';
}

export interface CompanyFilter {
  search: string;
  status: Company['status'] | 'Tous';
  page: number;
  pageSize: number;
}
