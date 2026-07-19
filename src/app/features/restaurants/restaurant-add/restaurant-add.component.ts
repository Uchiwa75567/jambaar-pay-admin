import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { firstValueFrom } from 'rxjs';
import { FeedbackMessage, FeedbackMessageComponent } from '../../../design-system/components/feedback-message/feedback-message.component';
import { RESTAURANTS_REPOSITORY, RestaurantsRepository } from '../application/restaurants.repository';
import { Restaurant } from '../domain/restaurant.model';
import {
  hasMinLength,
  hasValue,
  isPositiveNumber,
  isValidEmail,
  isValidNinea,
  isValidSenegalPhone,
} from '../../../core/utils/form-validation';

@Component({
    selector: 'app-restaurant-add',
    imports: [FormsModule, RouterModule, InputTextModule, SelectModule, FeedbackMessageComponent],
    templateUrl: './restaurant-add.component.html',
    styleUrls: ['./restaurant-add.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantAddComponent {
  private readonly router = inject(Router);
  private readonly restaurantsRepository = inject<RestaurantsRepository>(RESTAURANTS_REPOSITORY);

  submitted = signal(false);
  submitting = signal(false);
  feedback = signal<FeedbackMessage | null>(null);

  form = {
    name: '',
    cuisineType: null as string | null,
    managerName: '',
    email: '',
    phone: '',
    ninea: '',
    initialBalance: '',
    address: '',
  };

  cuisineOptions = [
    { label: 'Sénégalaise',   value: 'senegalaise'  },
    { label: 'Française',     value: 'francaise'    },
    { label: 'Asiatique',     value: 'asiatique'    },
    { label: 'Fast Food',     value: 'fastfood'     },
    { label: 'Internationale',value: 'internationale'},
  ];

  onCancel(): void {
    this.router.navigate(['/restaurants']);
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.feedback.set(null);

    if (!this.isFormValid() || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    try {
      await firstValueFrom(this.restaurantsRepository.upsert(this.buildRestaurant()));
      await this.router.navigate(['/restaurants']);
    } catch {
      this.feedback.set({
        type: 'error',
        message: 'Le restaurant n’a pas pu être enregistré. Veuillez réessayer.',
      });
    } finally {
      this.submitting.set(false);
    }
  }

  isFormValid(): boolean {
    return !this.nameError
      && !this.cuisineTypeError
      && !this.managerNameError
      && !this.emailError
      && !this.phoneError
      && !this.nineaError
      && !this.initialBalanceError
      && !this.addressError;
  }

  get nameError(): string {
    if (!hasValue(this.form.name)) return 'Le nom du restaurant est requis.';
    if (!hasMinLength(this.form.name, 2)) return 'Le nom du restaurant doit contenir au moins 2 caracteres.';
    return '';
  }

  get cuisineTypeError(): string {
    if (!this.form.cuisineType) return 'Le type de cuisine est requis.';
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

  private buildRestaurant(): Restaurant {
    return {
      id: `restaurant-${Date.now()}`,
      name: this.form.name.trim(),
      address: this.form.address.trim() || 'Non renseignee',
      phone: this.form.phone.trim() || undefined,
      totalTransactions: 0,
      totalVolume: this.toNumber(this.form.initialBalance),
      registrationDate: new Date().toISOString().slice(0, 10),
      status: 'Actif',
    };
  }

  private toNumber(value: string): number {
    const normalized = value.replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
