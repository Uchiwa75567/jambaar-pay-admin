import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

interface RegisterForm {
  companyName: string;
  email: string;
  phone: string;
  hrManager: string;
  sector: string;
  employeeCount: string;
  ninea: string;
  location: string;
  city: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  host: {
    class: 'register-page',
  },
  imports: [CommonModule, FormsModule, RouterLink, InputTextModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  step = signal<1 | 2>(1);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  submitted = signal(false);
  successMessage = signal('');

  form: RegisterForm = {
    companyName: '',
    email: '',
    phone: '',
    hrManager: '',
    sector: '',
    employeeCount: '',
    ninea: '',
    location: '',
    city: '',
    password: '',
    confirmPassword: '',
  };

  readonly passwordMinLength = 8;
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  private isFirstStepValid(): boolean {
    return this.hasValue(this.form.companyName)
      && this.emailPattern.test(this.form.email.trim())
      && this.hasValue(this.form.phone)
      && this.hasValue(this.form.hrManager)
      && this.hasValue(this.form.sector)
      && this.hasValue(this.form.employeeCount)
      && this.hasValue(this.form.ninea);
  }

  private isSecondStepValid(): boolean {
    return this.hasValue(this.form.location)
      && this.hasValue(this.form.city)
      && this.form.password.length >= this.passwordMinLength
      && this.form.password === this.form.confirmPassword;
  }

  private hasValue(value: string | number | null | undefined): boolean {
    return !!String(value ?? '').trim();
  }

  constructor(private router: Router) {}

  nextStep(): void {
    this.submitted.set(true);
    this.successMessage.set('');

    if (!this.isFirstStepValid()) {
      return;
    }

    this.submitted.set(false);
    this.step.set(2);
  }

  previousStep(): void {
    this.submitted.set(false);
    this.successMessage.set('');
    this.step.set(1);
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.successMessage.set('');

    if (!this.isSecondStepValid()) {
      return;
    }

    this.successMessage.set('Entreprise inscrite avec succès. Vous pouvez maintenant vous connecter.');
    setTimeout(() => this.router.navigate(['/login']), 700);
  }

  showRequiredError(value: string | number | null | undefined): boolean {
    return this.submitted() && !String(value ?? '').trim();
  }

  showEmailError(): boolean {
    const email = this.form.email.trim();
    return this.submitted() && (!email || !this.emailPattern.test(email));
  }

  showPasswordError(): boolean {
    return this.submitted() && this.form.password.length < this.passwordMinLength;
  }

  showConfirmPasswordError(): boolean {
    return this.submitted() && this.form.password !== this.form.confirmPassword;
  }
}
