import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FeedbackMessageComponent } from '../../design-system/components/feedback-message/feedback-message.component';
import { SettingsFacade } from './application/settings.facade';
import {
  hasMinLength,
  hasValue,
  isPositiveInteger,
  isPositiveNumber,
  isValidSenegalPhone,
} from '../../core/utils/form-validation';

@Component({
    selector: 'app-settings',
    imports: [FormsModule, InputTextModule, FeedbackMessageComponent],
    providers: [SettingsFacade],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  private readonly router = inject(Router);
  private readonly facade = inject(SettingsFacade);

  submitted = signal(false);
  readonly form = this.facade.form;
  readonly feedback = this.facade.feedback;

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    try {
      await firstValueFrom(this.facade.save());
    } catch {
      // La facade expose l'erreur normalisée au template.
    }
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
