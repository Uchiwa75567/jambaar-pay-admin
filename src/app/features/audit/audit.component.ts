import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DateFrPipe } from '../../shared/pipes/date-fr.pipe';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  date: string;
  ip: string;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, TableModule, DateFrPipe],
  templateUrl: './audit.component.html',
})
export class AuditComponent {
  logs: AuditLog[] = [
    { id: 'LOG-001', user: 'admin@jambaarpay.com', action: 'LOGIN',          target: 'Système',    date: '2024-01-15T08:32:00', ip: '196.1.20.45'  },
    { id: 'LOG-002', user: 'admin@jambaarpay.com', action: 'CREATE_COMPANY', target: 'Sonatel',    date: '2024-01-15T09:10:00', ip: '196.1.20.45'  },
    { id: 'LOG-003', user: 'admin@jambaarpay.com', action: 'UPDATE_STATUS',  target: 'Senelec',    date: '2024-01-15T10:45:00', ip: '196.1.20.45'  },
    { id: 'LOG-004', user: 'admin@jambaarpay.com', action: 'DELETE_COMPANY', target: 'Air Sénégal',date: '2024-01-14T14:20:00', ip: '196.1.20.45'  },
    { id: 'LOG-005', user: 'admin@jambaarpay.com', action: 'LOGOUT',         target: 'Système',    date: '2024-01-14T18:00:00', ip: '196.1.20.45'  },
  ];
}
