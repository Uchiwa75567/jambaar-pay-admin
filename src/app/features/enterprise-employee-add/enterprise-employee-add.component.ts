import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  hasMinLength,
  hasValue,
  isPositiveNumber,
  isValidEmail,
  isValidSenegalPhone,
} from '../../core/utils/form-validation';

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
  submitted = signal(false);

  form: EmployeeForm = {
    name: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    initialAmount: '',
  };

  constructor(private router: Router) {}

  onSubmit(): void {
    this.submitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    this.router.navigate(['/enterprise-employees']);
  }

  private isFormValid(): boolean {
    return !this.nameError
      && !this.positionError
      && !this.emailError
      && !this.phoneError
      && !this.addressError
      && !this.initialAmountError;
  }

  get nameError(): string {
    if (!hasValue(this.form.name)) return 'Le nom du salarie est requis.';
    if (!hasMinLength(this.form.name, 3)) return 'Le nom du salarie doit contenir au moins 3 caracteres.';
    return '';
  }

  get positionError(): string {
    if (!hasValue(this.form.position)) return 'Le poste est requis.';
    if (!hasMinLength(this.form.position, 2)) return 'Le poste doit contenir au moins 2 caracteres.';
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

  get addressError(): string {
    if (!this.form.address.trim()) return '';
    if (!hasMinLength(this.form.address, 5)) return 'L’adresse doit contenir au moins 5 caracteres.';
    return '';
  }

  get initialAmountError(): string {
    if (!this.form.initialAmount.trim()) return '';
    if (!isPositiveNumber(this.form.initialAmount)) return 'Le montant initial doit etre un montant positif.';
    return '';
  }
}
