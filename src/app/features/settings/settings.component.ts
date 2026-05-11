import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

interface SettingsForm {
  platformName: string;
  address: string;
  supportPhone: string;
  maxTransactionAmount: string;
  maxTransactionsPerDay: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  form: SettingsForm = {
    platformName: '',
    address: '',
    supportPhone: '',
    maxTransactionAmount: '',
    maxTransactionsPerDay: '',
  };

  constructor(private router: Router) {}

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    // TODO: connect to API
    console.log('Settings saved:', this.form);
  }
}
