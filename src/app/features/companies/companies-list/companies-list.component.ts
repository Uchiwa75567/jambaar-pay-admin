import { ChangeDetectionStrategy, Component, ElementRef, HostListener, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { EmptyStateComponent } from '../../../design-system/components/empty-state/empty-state.component';
import { FeedbackMessageComponent } from '../../../design-system/components/feedback-message/feedback-message.component';
import { LoadingStateComponent } from '../../../design-system/components/loading-state/loading-state.component';
import { PaginationComponent } from '../../../design-system/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../design-system/components/status-badge/status-badge.component';
import {
  CompaniesListFacade,
  CompanyDateFilter,
  CompanyStatusFilter,
} from './companies-list.facade';

@Component({
    selector: 'app-companies-list',
    imports: [DecimalPipe, FormsModule, RouterModule, TableModule, InputTextModule, MenuModule, EmptyStateComponent, FeedbackMessageComponent, LoadingStateComponent, PaginationComponent, StatusBadgeComponent],
    providers: [CompaniesListFacade],
    templateUrl: './companies-list.component.html',
    styleUrls: ['./companies-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesListComponent {
  private readonly el = inject(ElementRef);
  private readonly facade = inject(CompaniesListFacade);

  readonly searchTerm = this.facade.searchTerm;
  readonly statusFilter = this.facade.statusFilter;
  readonly dateFilter = this.facade.dateFilter;
  readonly pageSize = this.facade.pageSize;
  readonly currentPage = this.facade.currentPage;
  readonly feedback = this.facade.feedback;
  readonly loading = this.facade.loading;
  readonly filterLabel = this.facade.filterLabel;
  readonly pageSizeOptions = this.facade.pageSizeOptions;
  readonly statusOptions = this.facade.statusOptions;
  readonly dateOptions = this.facade.dateOptions;
  readonly totalPages = this.facade.totalPages;
  readonly companies = this.facade.companies;

  readonly filterMenuOpen = signal(false);
  readonly exportMenuOpen = signal(false);
  readonly menuItems: MenuItem[] = [
    { label: 'Voir détails', icon: 'pi pi-eye' },
    { label: 'Modifier', icon: 'pi pi-pencil' },
    { label: 'Désactiver', icon: 'pi pi-ban', styleClass: 'danger-item' },
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.filterMenuOpen.set(false);
      this.exportMenuOpen.set(false);
    }
  }

  onSearchChange(value: string): void {
    this.facade.setSearchTerm(value);
  }

  setPageSize(size: number): void {
    this.facade.setPageSize(size);
  }

  setPage(page: number | '...'): void {
    this.facade.setPage(page);
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

  toggleExportMenu(): void {
    this.exportMenuOpen.update(isOpen => !isOpen);
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
