import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  employees: EmployeeRow[] = Array.from({ length: 6 }, () => ({
    name: '#38932987',
    email: 'sal@gmail.com',
    phone: '777777777',
    balance: '2 000 Fcfa',
    status: 'Validé',
  }));

  goToAddEmployee(): void {
    this.router.navigate(['/enterprise-employees/add']);
  }
}
