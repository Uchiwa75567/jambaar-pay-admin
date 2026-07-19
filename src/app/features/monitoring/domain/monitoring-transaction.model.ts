export type MonitoringTransactionStatus = 'Validé' | 'En attente' | 'Échoué';

export interface MonitoringTransaction {
  id: string;
  employee: string;
  company: string;
  restaurant: string;
  amount: string;
  date: string;
  status: MonitoringTransactionStatus;
}
