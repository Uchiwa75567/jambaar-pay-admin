import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface EmployeeForm {
  name: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  initialAmount: string;
}

@Component({
  selector: 'app-enterprise-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './enterprise-employee-add.component.html',
  styleUrls: ['./enterprise-employee-add.component.scss'],
})
export class EnterpriseEmployeeAddComponent {
  form: EmployeeForm = {
    name: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    initialAmount: '',
  };
}
