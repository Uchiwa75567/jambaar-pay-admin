import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

interface EnterpriseKpi {
  label: string;
  value: string;
  changeLabel: string;
  iconSrc: string;
}

interface EnterpriseTransaction {
  employee: string;
  restaurant: string;
  amount: string;
  date: string;
  status: 'Validé';
}

@Component({
  selector: 'app-enterprise-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './enterprise-dashboard.component.html',
  styleUrls: ['./enterprise-dashboard.component.scss'],
})
export class EnterpriseDashboardComponent {
  kpis: EnterpriseKpi[] = [
    { label: 'Salarié', value: '47', changeLabel: '15%', iconSrc: 'assets/icons/icon-business.svg' },
    { label: 'Restaurants proches', value: '+20', changeLabel: '15%', iconSrc: 'assets/icons/icon-restaurants.svg' },
    { label: 'Transactions', value: '390', changeLabel: '15%', iconSrc: 'assets/icons/icon-transactions.svg' },
    { label: 'Volumes en Fcfa', value: '2M', changeLabel: 'ce mois', iconSrc: 'assets/icons/icon-volumes.svg' },
  ];

  transactions: EnterpriseTransaction[] = Array.from({ length: 11 }, () => ({
    employee: '#38932987',
    restaurant: 'Entreprise 1',
    amount: '2 000 Fcfa',
    date: '2026-04-15',
    status: 'Validé',
  }));
}
