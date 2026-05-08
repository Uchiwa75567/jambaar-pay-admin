export interface DashboardKPI {
  label: string;
  value: number | string;
  change: number;
  changeLabel?: string;
  unit?: string;
  icon?: string;
  iconSrc?: string;
}

export interface TopRestaurant {
  rank: number;
  name: string;
  transactions: number;
  volume: number;
}

export interface RecentActivity {
  transactionId: string;
  company: string;
  restaurant: string;
  amount: number;
  date: string;
  status: 'Validé' | 'En cours' | 'Échoué';
}
