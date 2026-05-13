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
    status: 'Validé' as const,
  }));

  chartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const labels = ['Apr10', 'Apr 11', 'Apr12', 'Apr13', 'Apr 14', 'Apr 15', 'Apr 16'];
    const data = [52, 25, 78, 88, 66, 104, 87];

    this.chartData = {
      labels,
      datasets: [{
        label: 'Transactions',
        data,
        fill: true,
        borderColor: '#fde67a',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const area = chart.chartArea;
          if (!area) return 'rgba(253, 230, 122, 0.18)';
          const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
          gradient.addColorStop(0, 'rgba(253, 230, 122, 0.34)');
          gradient.addColorStop(1, 'rgba(253, 230, 122, 0.03)');
          return gradient;
        },
        tension: 0.42,
        borderWidth: 4,
        pointBackgroundColor: '#F7E47A',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: (ctx: any) => ctx.dataIndex === 5 ? 7 : 0,
        pointHoverRadius: 8,
      }],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: '#fff',
          titleColor: '#1A1A2E',
          bodyColor: '#8d8d8d',
          borderColor: 'rgba(0,0,0,0.08)',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx: any) => ` ${ctx.parsed.y}%`,
          },
        },
      },
      layout: {
        padding: {
          bottom: 16,
          left: 6,
          right: 8,
          top: 8,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#1A1A2E',
            font: { size: 11, family: 'Inter', weight: '600' },
            padding: 14,
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          min: 0,
          max: 110,
          grid: { color: 'rgba(0,0,0,0.045)' },
          border: { display: false },
          ticks: { stepSize: 25, color: '#1A1A2E', font: { size: 12, family: 'Inter', weight: '600' } },
          position: 'left',
        },
      },
    };
  }
}
