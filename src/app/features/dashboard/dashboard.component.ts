import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { FcfaCurrencyPipe } from '../../shared/pipes/fcfa-currency.pipe';
import { DateFrPipe } from '../../shared/pipes/date-fr.pipe';
import { DashboardKPI, TopRestaurant, RecentActivity } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ChartModule, KpiCardComponent, StatusBadgeComponent, FcfaCurrencyPipe, DateFrPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  kpis: DashboardKPI[] = [
    { label: 'Entreprises',    value: 47,    change: 15,                    icon: 'pi pi-building'    },
    { label: 'Restaurants',    value: '+20', change: 15,                    icon: 'pi pi-home'        },
    { label: 'Transactions',   value: 390,   change: 15,                    icon: 'pi pi-credit-card' },
    { label: 'Volumes en Fcfa', value: '21M', change: 0, changeLabel: 'ce mois', icon: 'pi pi-wallet' },
  ];

  topRestaurants: TopRestaurant[] = [
    { rank: 1, name: 'Restaurant Le Djolof', transactions: 340, volume: 892_998 },
    { rank: 2, name: 'Le Plat',              transactions: 340, volume: 892_998 },
    { rank: 3, name: 'La Téranga',           transactions: 340, volume: 892_998 },
    { rank: 5, name: 'Thiébou Ndar',         transactions: 340, volume: 892_998 },
    { rank: 6, name: 'FoodGood',             transactions: 340, volume: 892_998 },
  ];

  recentActivities: RecentActivity[] = [
    { transactionId: '#38932987', company: 'Entreprise 1', restaurant: 'Restaurant Le Djolof', amount: 2_000,  date: '2026-04-15', status: 'Validé'   },
    { transactionId: '#38501234', company: 'Entreprise 2', restaurant: 'Le Plat',               amount: 5_500,  date: '2026-04-15', status: 'Validé'   },
    { transactionId: '#38765432', company: 'Entreprise 3', restaurant: 'La Téranga',            amount: 3_200,  date: '2026-04-14', status: 'En cours' },
    { transactionId: '#38998765', company: 'Entreprise 1', restaurant: 'Thiébou Ndar',          amount: 1_800,  date: '2026-04-14', status: 'Validé'   },
    { transactionId: '#38112233', company: 'Entreprise 4', restaurant: 'FoodGood',              amount: 7_400,  date: '2026-04-13', status: 'Échoué'   },
    { transactionId: '#38445566', company: 'Entreprise 2', restaurant: 'Restaurant Le Djolof',  amount: 4_100,  date: '2026-04-13', status: 'Validé'   },
  ];

  chartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const labels = ['Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14', 'Apr 15', 'Apr 16'];
    const data   = [55, 65, 28, 75, 85, 105, 68];

    this.chartData = {
      labels,
      datasets: [{
        label: 'Transactions',
        data,
        fill: true,
        borderColor: '#F5C542',
        backgroundColor: 'rgba(245, 197, 66, 0.15)',
        tension: 0.4,
        pointBackgroundColor: '#F5C542',
        pointRadius: 4,
        pointHoverRadius: 6,
      }],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ` ${ctx.parsed.y} transactions`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#6C757D', font: { size: 11 } } },
        y: { grid: { color: '#F0F0F0' }, ticks: { color: '#6C757D', font: { size: 11 } } },
      },
    };
  }
}
