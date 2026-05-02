import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './monitoring.component.html',
})
export class MonitoringComponent {
  metrics = [
    { label: 'Taux de succès',  value: '97.4%',  icon: 'pi pi-check-circle',  color: '#22C55E' },
    { label: 'Taux d\'échec',   value: '2.6%',   icon: 'pi pi-times-circle',  color: '#EF4444' },
    { label: 'Temps moyen',     value: '1.2s',   icon: 'pi pi-clock',         color: '#E8731A' },
    { label: 'Alertes actives', value: '3',      icon: 'pi pi-bell',          color: '#F59E0B' },
  ];
}
