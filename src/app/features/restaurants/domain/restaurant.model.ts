export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone?: string;
  totalTransactions: number;
  totalVolume: number;
  registrationDate: string;
  status: 'Actif' | 'Inactif';
}
