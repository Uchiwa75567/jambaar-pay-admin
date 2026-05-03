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
    { label: 'Entreprises', value: 47, change: 15, icon: 'pi pi-building' },
    { label: 'Restaurants', value: '+20', change: 15, icon: 'pi pi-home' },
    { label: 'Transactions', value: 390, change: 15, icon: 'pi pi-chart-line' },
    { label: 'Volumes en Fcfa', value: '21M', change: 0, changeLabel: 'ce mois', icon: 'pi pi-wallet' },
  ];

  topRestaurants: TopRestaurant[] = [
    { rank: 1, name: 'Restaurant Le Djolof', transactions: 340, volume: 892_998 },
    { rank: 2, name: 'Le Plat', transactions: 340, volume: 892_998 },
    { rank: 3, name: 'La Téranga', transactions: 340, volume: 892_998 },
    { rank: 5, name: 'Thiébou Ndar', transactions: 340, volume: 892_998 },
    { rank: 6, name: 'FoodGood', transactions: 340, volume: 892_998 },
  ];

  recentActivities: RecentActivity[] = Array.from({ length: 6 }, () => ({
    transactionId: '#38932987',
    company: 'Entreprise 1',
    restaurant: 'Restaurant 2',
    amount: 2_000,
    date: '2026-04-15',
    status: 'Validé',
  }));

  chartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const labels = ['Apr10', 'Apr11', 'Apr12', 'Apr13', 'Apr14', 'Apr15', 'Apr16'];
    const data = [55, 68, 27, 76, 86, 104, 50, 88, 108, 77, 88];

    this.chartData = {
      labels,
      datasets: [{
        label: 'Transactions',
        data,
        fill: true,
        borderColor: '#F7E47A',
        backgroundColor: 'rgba(247, 228, 122, 0.22)',
        tension: 0.42,
        borderWidth: 4,
        pointBackgroundColor: '#F7E47A',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 8,
      }],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.y} transactions` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#1A1A2E', font: { size: 12, weight: '600' } } },
        y: { min: 0, max: 110, grid: { color: '#F4F1DF' }, ticks: { stepSize: 25, color: '#1A1A2E', font: { size: 13, weight: '600' } } },
      },
    };
  }
}
