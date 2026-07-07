import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import {
  CompaniesListFacade,
  CompanyDateFilter,
  CompanyStatusFilter,
} from './companies-list.facade';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, InputTextModule, MenuModule, StatusBadgeComponent],
  providers: [CompaniesListFacade],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
})
export class CompaniesListComponent {
  readonly searchTerm = this.facade.searchTerm;
  readonly statusFilter = this.facade.statusFilter;
  readonly dateFilter = this.facade.dateFilter;
  readonly pageSize = this.facade.pageSize;
  readonly currentPage = this.facade.currentPage;
  readonly feedback = this.facade.feedback;
  readonly filterLabel = this.facade.filterLabel;
  readonly pageSizeOptions = this.facade.pageSizeOptions;
  readonly statusOptions = this.facade.statusOptions;
  readonly dateOptions = this.facade.dateOptions;
  readonly visiblePages = this.facade.visiblePages;
  readonly totalPages = this.facade.totalPages;
  readonly companies = this.facade.companies;

  readonly pageSizeMenuOpen = signal(false);
  readonly filterMenuOpen = signal(false);
  readonly exportMenuOpen = signal(false);

  constructor(
    private readonly el: ElementRef,
    private readonly facade: CompaniesListFacade
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.pageSizeMenuOpen.set(false);
      this.filterMenuOpen.set(false);
      this.exportMenuOpen.set(false);
    }
  }

  onSearchChange(value: string): void {
    this.facade.setSearchTerm(value);
  }

  setPageSize(size: number): void {
    this.facade.setPageSize(size);
    this.pageSizeMenuOpen.set(false);
  }

  setPage(page: number | '...'): void {
    this.facade.setPage(page);
  }

  prevPage(): void {
    this.facade.prevPage();
  }

  nextPage(): void {
    this.facade.nextPage();
  }

  setStatusFilter(status: CompanyStatusFilter): void {
    this.facade.setStatusFilter(status);
    this.filterMenuOpen.set(false);
  }

  setDateFilter(date: CompanyDateFilter): void {
    this.facade.setDateFilter(date);
    this.filterMenuOpen.set(false);
  }

  toggleFilterMenu(): void {
    this.filterMenuOpen.update(isOpen => !isOpen);
  }

  togglePageSizeMenu(): void {
    this.pageSizeMenuOpen.update(isOpen => !isOpen);
  }

  toggleExportMenu(): void {
    this.exportMenuOpen.update(isOpen => !isOpen);
  }

  getMenuItems(): MenuItem[] {
    return [
      { label: 'Voir détails', icon: 'pi pi-eye' },
      { label: 'Modifier', icon: 'pi pi-pencil' },
      { label: 'Désactiver', icon: 'pi pi-ban', styleClass: 'danger-item' },
    ];
  }

  async onImportFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      await this.facade.importCompanies(file);
    } catch (error) {
      this.facade.setErrorFeedback(error, 'Import impossible.');
    } finally {
      input.value = '';
    }
  }

  exportExcel(): void {
    this.facade.exportExcel();
    this.exportMenuOpen.set(false);
  }

  exportPdf(): void {
    try {
      this.facade.exportPdf();
    } catch (error) {
      this.facade.setErrorFeedback(error, 'Export PDF impossible.');
    } finally {
      this.exportMenuOpen.set(false);
    }
  }
}
