import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import {
  hasMinLength,
  hasValue,
  isPositiveNumber,
  isValidEmail,
  isValidNinea,
  isValidSenegalPhone,
} from '../../../core/utils/form-validation';

@Component({
  selector: 'app-company-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputTextModule],
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss'],
})
export class CompanyAddComponent {
  submitted = signal(false);

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
    this.submitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    // TODO: call API
    this.router.navigate(['/companies']);
  }

  isFormValid(): boolean {
    return !this.nameError
      && !this.sectorError
      && !this.managerNameError
      && !this.emailError
      && !this.phoneError
      && !this.nineaError
      && !this.initialBalanceError
      && !this.addressError;
  }

  get nameError(): string {
    if (!hasValue(this.form.name)) return 'Le nom de l’entreprise est requis.';
    if (!hasMinLength(this.form.name, 2)) return 'Le nom de l’entreprise doit contenir au moins 2 caracteres.';
    return '';
  }

  get sectorError(): string {
    if (!hasValue(this.form.sector)) return 'Le secteur d’activite est requis.';
    return '';
  }

  get managerNameError(): string {
    if (!hasValue(this.form.managerName)) return 'Le nom du responsable est requis.';
    if (!hasMinLength(this.form.managerName, 3)) return 'Le nom du responsable doit contenir au moins 3 caracteres.';
    return '';
  }

  get emailError(): string {
    if (!hasValue(this.form.email)) return 'L’adresse email est requise.';
    if (!isValidEmail(this.form.email)) return 'Veuillez saisir une adresse email valide.';
    return '';
  }

  get phoneError(): string {
    if (!hasValue(this.form.phone)) return 'Le numero de telephone est requis.';
    if (!isValidSenegalPhone(this.form.phone)) return 'Veuillez saisir un numero senegalais valide sur 9 chiffres.';
    return '';
  }

  get nineaError(): string {
    if (!this.form.ninea.trim()) return '';
    if (!isValidNinea(this.form.ninea)) return 'Le NINEA doit contenir entre 6 et 20 caracteres valides.';
    return '';
  }

  get initialBalanceError(): string {
    if (!this.form.initialBalance.trim()) return '';
    if (!isPositiveNumber(this.form.initialBalance)) return 'Le solde initial doit etre un montant positif.';
    return '';
  }

  get addressError(): string {
    if (!this.form.address.trim()) return '';
    if (!hasMinLength(this.form.address, 5)) return 'L’adresse doit contenir au moins 5 caracteres.';
    return '';
  }
}
