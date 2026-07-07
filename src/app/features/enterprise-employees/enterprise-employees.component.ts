import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import {
  EmployeeStatusFilter,
  EnterpriseEmployeesFacade,
} from './enterprise-employees.facade';

@Component({
  selector: 'app-enterprise-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule],
  providers: [EnterpriseEmployeesFacade],
  templateUrl: './enterprise-employees.component.html',
  styleUrls: ['./enterprise-employees.component.scss'],
})
export class EnterpriseEmployeesComponent {
  readonly searchTerm = this.facade.searchTerm;
  readonly statusFilter = this.facade.statusFilter;
  readonly pageSize = this.facade.pageSize;
  readonly currentPage = this.facade.currentPage;
  readonly feedback = this.facade.feedback;
  readonly statusOptions = this.facade.statusOptions;
  readonly pageSizeOptions = this.facade.pageSizeOptions;
  readonly visiblePages = this.facade.visiblePages;
  readonly totalPages = this.facade.totalPages;
  readonly employees = this.facade.employees;

  readonly filterMenuOpen = signal(false);
  readonly pageSizeMenuOpen = signal(false);

  constructor(
    private readonly router: Router,
    private readonly el: ElementRef,
    private readonly facade: EnterpriseEmployeesFacade,
  ) {}

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

  async onImportEmployees(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      await this.facade.importEmployees(file);
    } catch (error) {
      this.facade.setErrorFeedback(error, 'Import impossible.');
    } finally {
      input.value = '';
    }
  }

  async onImportBalances(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      await this.facade.importBalances(file);
    } catch (error) {
      this.facade.setErrorFeedback(error, 'Import des soldes impossible.');
    } finally {
      input.value = '';
    }
  }

  exportEmployees(): void {
    this.facade.exportEmployees();
  }

  onSearchChange(value: string): void {
    this.facade.setSearchTerm(value);
  }

  toggleFilterMenu(): void {
    this.filterMenuOpen.update(open => !open);
  }

  setStatusFilter(status: EmployeeStatusFilter): void {
    this.facade.setStatusFilter(status);
    this.filterMenuOpen.set(false);
  }

  togglePageSizeMenu(): void {
    this.pageSizeMenuOpen.update(open => !open);
  }

  setPageSize(size: number): void {
    this.facade.setPageSize(size);
    this.pageSizeMenuOpen.set(false);
  }

  setPage(page: number): void {
    this.facade.setPage(page);
  }

  previousPage(): void {
    this.facade.previousPage();
  }

  nextPage(): void {
    this.facade.nextPage();
  }
}
