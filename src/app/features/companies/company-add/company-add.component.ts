import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-company-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputTextModule],
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss'],
})
export class CompanyAddComponent {
  form = {
    name: '',
    sector: '',
    managerName: '',
    email: '',
    phone: '',
    ninea: '',
    initialBalance: '',
    address: '',
  };

  constructor(private router: Router) {}

  onCancel(): void {
    this.router.navigate(['/companies']);
  }

  onSubmit(): void {
    // TODO: call API
    this.router.navigate(['/companies']);
  }
}
