import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

interface HistoryTransaction {
  employee: string;
  restaurant: string;
  amount: string;
  date: string;
  status: 'Validé';
}

@Component({
  selector: 'app-enterprise-history',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './enterprise-history.component.html',
  styleUrls: ['./enterprise-history.component.scss'],
})
export class EnterpriseHistoryComponent {
  transactions: HistoryTransaction[] = Array.from({ length: 11 }, () => ({
    employee: '#38932987',
    restaurant: 'Entreprise 1',
    amount: '2 000 Fcfa',
    date: '2026-04-15',
    status: 'Validé',
  }));
}
