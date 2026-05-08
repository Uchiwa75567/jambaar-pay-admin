import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() change = 0;
  @Input() changeLabel = '';
  @Input() unit = '';
  @Input() icon = 'pi pi-chart-line';
  @Input() iconSrc = '';

  get displayChange(): string {
    return this.changeLabel || `${this.change}%`;
  }
}
