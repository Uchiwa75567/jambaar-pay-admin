import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  imports: [CommonModule, RouterLink, CardModule, TableModule, ChartModule, KpiCardComponent, StatusBadgeComponent, FcfaCurrencyPipe, DateFrPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  kpis: DashboardKPI[] = [
    {
      label: 'Entreprises',
      value: 47,
      change: 15,
      icon: 'pi pi-building',
      iconSrc: 'assets/icons/icon-business.svg',
    },
    {
      label: 'Restaurants',
      value: '+20',
      change: 15,
      icon: 'pi pi-home',
      iconSrc: 'assets/icons/icon-restaurant-kpi.svg',
    },
    {
      label: 'Transactions',
      value: 390,
      change: 15,
      icon: 'pi pi-chart-line',
      iconSrc: 'assets/icons/icon-transactions.svg',
    },
    {
      label: 'Volumes en Fcfa',
      value: '21M',
      change: 0,
      changeLabel: 'ce mois',
      icon: 'pi pi-wallet',
      iconSrc: 'assets/icons/icon-volumes.svg',
    },
  ];

  topRestaurants: TopRestaurant[] = [
    { rank: 1, name: 'Restaurant Le Djolof', transactions: 340, volume: 892_998 },
    { rank: 2, name: 'Le Plat',              transactions: 340, volume: 892_998 },
    { rank: 3, name: 'La Téranga',           transactions: 340, volume: 892_998 },
    { rank: 5, name: 'Thiébou Ndar',         transactions: 340, volume: 892_998 },
    { rank: 6, name: 'FoodGood',             transactions: 340, volume: 892_998 },
  ];

  recentActivities: RecentActivity[] = Array.from({ length: 5 }, () => ({
    transactionId: '#38932987',
    company:       'Entreprise 1',
    restaurant:    'Restaurant 2',
    amount:        2_000,
    date:          '2026-04-15',
    status:        'Validé' as const,
  }));

  chartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const labels = ['Apr10', 'Apr11', 'Apr12', 'Apr13', 'Apr14', 'Apr15', 'Apr16'];
    const data   = [250, 150, 300, 350, 400, 220, 450];

    this.chartData = {
      labels,
      datasets: [{
        label: 'Transactions',
        data,
        fill: true,
        borderColor: '#F7E47A',
        backgroundColor: 'rgba(247, 228, 122, 0.18)',
        tension: 0.45,
        borderWidth: 3,
        pointBackgroundColor: '#F7E47A',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 7,
      }],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ` ${ctx.parsed.y}%`,
          },
        },
      },
      layout: {
        padding: {
          bottom: 20,
          left: 8,
          right: 8,
          top: 0,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { 
            color: '#1A1A2E', 
            font: { size: 11, family: 'Inter', weight: '600' },
            padding: 12,
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          min: 0,
          max: 500,
          grid: { color: 'rgba(0,0,0,0.06)' },
          ticks: { stepSize: 100, color: '#1A1A2E', font: { size: 12, family: 'Inter', weight: '600' } },
          position: 'left',
        },
      },
    };
  }
}
