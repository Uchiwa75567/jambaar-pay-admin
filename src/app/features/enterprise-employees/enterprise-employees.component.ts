import { Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

interface EmployeeRow {
  name: string;
  email: string;
  phone: string;
  balance: string;
  status: 'Validé';
}

type StatusFilter = 'Tous' | 'Validé';

@Component({
  selector: 'app-enterprise-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule],
  templateUrl: './enterprise-employees.component.html',
  styleUrls: ['./enterprise-employees.component.scss'],
})
export class EnterpriseEmployeesComponent {
  private readonly allEmployees: EmployeeRow[] = Array.from({ length: 144 }, () => ({
    name: '#38932987',
    email: 'sal@gmail.com',
    phone: '777777777',
    balance: '2 000 Fcfa',
    status: 'Validé',
  }));

  searchTerm = signal('');
  statusFilter = signal<StatusFilter>('Tous');
  pageSize = signal(5);
  currentPage = signal(1);
  filterMenuOpen = signal(false);
  pageSizeMenuOpen = signal(false);

  readonly statusOptions: StatusFilter[] = ['Tous', 'Validé'];
  readonly pageSizeOptions = [5, 10];

  filteredEmployees = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.allEmployees.filter(employee => {
      const matchesSearch = !query || [
        employee.name,
        employee.email,
        employee.phone,
        employee.balance,
      ].some(value => value.toLowerCase().includes(query));
      const matchesStatus = status === 'Tous' || employee.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredEmployees().length / this.pageSize()))
  );

  visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 6) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, '...', total];
    }

    if (current >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  });

  employees = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredEmployees().slice(start, start + this.pageSize());
  });

  constructor(private router: Router, private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.filterMenuOpen.set(false);
      this.pageSizeMenuOpen.set(false);
    }
  }

  goToAddEmployee(): void {
    this.router.navigate(['/enterprise-employees/add']);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  toggleFilterMenu(): void {
    this.filterMenuOpen.update(open => !open);
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.filterMenuOpen.set(false);
  }

  togglePageSizeMenu(): void {
    this.pageSizeMenuOpen.update(open => !open);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.pageSizeMenuOpen.set(false);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }
}
