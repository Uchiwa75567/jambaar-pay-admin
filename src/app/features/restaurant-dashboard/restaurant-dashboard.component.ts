import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface RecentPayment {
  initials: string;
  customer: string;
  table: string;
  time: string;
  amount: string;
  tone: 'blue' | 'violet' | 'green' | 'sky' | 'gold';
}

interface PartnerCompany {
  name: string;
  employees: string;
  amount: string;
  status: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurant-dashboard.component.html',
  styleUrls: ['./restaurant-dashboard.component.scss'],
})
export class RestaurantDashboardComponent {
  readonly recentPayments: RecentPayment[] = [
    { initials: 'SM', customer: 'Sophie Martin', table: 'Table 4', time: '13h25', amount: '+ 14 500 FCFA', tone: 'blue' },
    { initials: 'JD', customer: 'Jean Dupont', table: 'Table 12', time: '13h42', amount: '+ 8 200 FCFA', tone: 'violet' },
    { initials: 'ML', customer: 'Marie Leclerc', table: 'Table 7', time: '14h05', amount: '+ 32 000 FCFA', tone: 'green' },
    { initials: 'TB', customer: 'Thomas Bernard', table: 'Table 3', time: '14h18', amount: '+ 5 500 FCFA', tone: 'sky' },
  ];

  readonly partnerCompanies: PartnerCompany[] = [
    { name: 'Sonatel', employees: '1 240', amount: '18 450 000', status: 'Actif' },
    { name: 'Orange Senegal', employees: '980', amount: '14 200 000', status: 'Actif' },
    { name: 'Air Senegal', employees: '420', amount: '6 800 000', status: 'Inactif' },
    { name: 'CFAO Senegal', employees: '1 860', amount: '27 100 000', status: 'Actif' },
  ];
}
