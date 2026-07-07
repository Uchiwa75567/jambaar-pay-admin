import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import {
  hasMinLength,
  hasValue,
  isPositiveInteger,
  isPositiveNumber,
  isValidSenegalPhone,
} from '../../core/utils/form-validation';

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
  submitted = signal(false);
  successMessage = signal('');

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
    this.submitted.set(true);
    this.successMessage.set('');

    if (!this.isFormValid()) {
      return;
    }

    // TODO: connect to API
    console.log('Settings saved:', this.form);
    this.successMessage.set('Les parametres ont ete valides et sont prets a etre enregistres.');
  }

  private isFormValid(): boolean {
    return !this.platformNameError
      && !this.addressError
      && !this.supportPhoneError
      && !this.maxTransactionAmountError
      && !this.maxTransactionsPerDayError;
  }

  get platformNameError(): string {
    if (!hasValue(this.form.platformName)) return 'Le nom de la plateforme est requis.';
    if (!hasMinLength(this.form.platformName, 3)) return 'Le nom de la plateforme doit contenir au moins 3 caracteres.';
    return '';
  }

  get addressError(): string {
    if (!this.form.address.trim()) return '';
    if (!hasMinLength(this.form.address, 5)) return 'L’adresse doit contenir au moins 5 caracteres.';
    return '';
  }

  get supportPhoneError(): string {
    if (!hasValue(this.form.supportPhone)) return 'Le telephone support est requis.';
    if (!isValidSenegalPhone(this.form.supportPhone)) return 'Veuillez saisir un numero support senegalais valide sur 9 chiffres.';
    return '';
  }

  get maxTransactionAmountError(): string {
    if (!hasValue(this.form.maxTransactionAmount)) return 'Le montant maximum par transaction est requis.';
    if (!isPositiveNumber(this.form.maxTransactionAmount)) return 'Le montant maximum doit etre positif.';
    return '';
  }

  get maxTransactionsPerDayError(): string {
    if (!hasValue(this.form.maxTransactionsPerDay)) return 'Le nombre de transactions par jour est requis.';
    if (!isPositiveInteger(this.form.maxTransactionsPerDay)) return 'Le quota journalier doit etre un entier positif.';
    return '';
  }
}
