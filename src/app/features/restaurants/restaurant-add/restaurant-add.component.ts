import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-restaurant-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputTextModule, DropdownModule],
  templateUrl: './restaurant-add.component.html',
  styleUrls: ['./restaurant-add.component.scss'],
})
export class RestaurantAddComponent {
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

  constructor(private router: Router) {}

  onCancel(): void {
    this.router.navigate(['/restaurants']);
  }

  onSubmit(): void {
    // TODO: call API
    this.router.navigate(['/restaurants']);
  }
}
