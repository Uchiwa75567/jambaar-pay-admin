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
  status: string;
  page: number;
  pageSize: number;
}
