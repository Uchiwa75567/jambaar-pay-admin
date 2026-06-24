import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { LoginForm } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  host: {
    class: 'login-page',
  },
  imports: [CommonModule, FormsModule, RouterLink, InputTextModule, CheckboxModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: LoginForm = { email: '', password: '', rememberMe: false };
  showPassword = signal(false);
  loading = signal(false);
  error = signal('');
  submitted = signal(false);

  readonly passwordMinLength = 8;
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  constructor(private auth: AuthService, private router: Router) {}

  get emailError(): string {
    const email = this.form.email.trim();
    if (!email) return 'Veuillez renseigner votre adresse email.';
    if (!this.emailPattern.test(email)) return 'Veuillez saisir une adresse email valide.';
    return '';
  }

  get passwordError(): string {
    const password = this.form.password;
    if (!password) return 'Veuillez renseigner votre mot de passe.';
    if (password.length < this.passwordMinLength) {
      return `Le mot de passe doit contenir au moins ${this.passwordMinLength} caracteres.`;
    }
    return '';
  }

  get isFormValid(): boolean {
    return !this.emailError && !this.passwordError;
  }

  shouldShowEmailError(): boolean {
    return this.submitted() && !!this.emailError;
  }

  shouldShowPasswordError(): boolean {
    return this.submitted() && !!this.passwordError;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.error.set('');
    this.form.email = this.form.email.trim();

    if (!this.isFormValid) {
      return;
    }

    this.loading.set(true);
    setTimeout(() => {
      const ok = this.auth.login(this.form);
      this.loading.set(false);
      if (ok) {
        this.router.navigate([this.auth.getLandingRoute()]);
      } else {
        this.error.set('Email ou mot de passe incorrect.');
      }
    }, 600);
  }
}
