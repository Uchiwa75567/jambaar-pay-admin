import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

interface EmployeeRow {
  name: string;
  email: string;
  phone: string;
  balance: string;
  status: 'Validé';
}

@Component({
  selector: 'app-enterprise-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule],
  templateUrl: './enterprise-employees.component.html',
  styleUrls: ['./enterprise-employees.component.scss'],
})
export class EnterpriseEmployeesComponent {
  searchTerm = '';

  employees: EmployeeRow[] = Array.from({ length: 6 }, () => ({
    name: '#38932987',
    email: 'sal@gmail.com',
    phone: '777777777',
    balance: '2 000 Fcfa',
    status: 'Validé',
  }));
}
