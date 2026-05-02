import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type StatusType = 'Validé' | 'En cours' | 'Échoué' | 'Actif' | 'Inactif';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="badgeClass">{{ status }}</span>`,
})
export class StatusBadgeComponent {
  @Input() status: StatusType = 'Actif';

  get badgeClass(): string {
    const map: Record<StatusType, string> = {
      'Validé':   'badge-valid',
      'En cours': 'badge-pending',
      'Échoué':   'badge-failed',
      'Actif':    'badge-active',
      'Inactif':  'badge-inactive',
    };
    return map[this.status] ?? 'badge-inactive';
  }
}
