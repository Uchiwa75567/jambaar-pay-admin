import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  imports: [CommonModule, FormsModule, InputTextModule, CheckboxModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: LoginForm = { email: '', password: '', rememberMe: false };
  showPassword = signal(false);
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.error.set('');
    if (!this.form.email || !this.form.password) {
      this.error.set('Veuillez remplir tous les champs.');
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      const ok = this.auth.login(this.form);
      this.loading.set(false);
      if (ok) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Email ou mot de passe incorrect.');
      }
    }, 600);
  }
}
