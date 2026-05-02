export interface Transaction {
  id: string;
  companyId: string;
  restaurantId: string;
  amount: number;
  date: string;
  status: 'Validé' | 'En cours' | 'Échoué';
}
