import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

export interface AuditLog {
  action: string;
  user: string;
  details: string;
  date: string;
}

const MOCK_LOGS: AuditLog[] = Array.from({ length: 9 }, () => ({
  action:  'Création entreprise',
  user:    'Admin Principal',
  details: 'Sonatel SA ajoutée',
  date:    '2024-01-15 10:30',
}));

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent {
  searchTerm   = signal('');
  statusFilter = signal('Tous');

  logs = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return q ? MOCK_LOGS.filter(l =>
      l.action.toLowerCase().includes(q)  ||
      l.user.toLowerCase().includes(q)    ||
      l.details.toLowerCase().includes(q)
    ) : MOCK_LOGS;
  });
}
