import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { EmptyStateComponent } from '../../design-system/components/empty-state/empty-state.component';
import { FeedbackMessageComponent } from '../../design-system/components/feedback-message/feedback-message.component';
import { LoadingStateComponent } from '../../design-system/components/loading-state/loading-state.component';
import { PaginationComponent } from '../../design-system/components/pagination/pagination.component';
import { AuditActionFilter, AuditFacade } from './application/audit.facade';

@Component({
  selector: 'app-audit',
  imports: [
    FormsModule,
    InputTextModule,
    TableModule,
    EmptyStateComponent,
    FeedbackMessageComponent,
    LoadingStateComponent,
    PaginationComponent,
  ],
  providers: [AuditFacade],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditComponent {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly facade = inject(AuditFacade);

  readonly searchTerm = this.facade.searchTerm;
  readonly actionFilter = this.facade.actionFilter;
  readonly pageSize = this.facade.pageSize;
  readonly currentPage = this.facade.currentPage;
  readonly loading = this.facade.loading;
  readonly feedback = this.facade.feedback;
  readonly pageSizeOptions = this.facade.pageSizeOptions;
  readonly filterOptions = this.facade.filterOptions;
  readonly totalPages = this.facade.totalPages;
  readonly logs = this.facade.logs;
  readonly filterMenuOpen = signal(false);
  readonly exportMenuOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.element.nativeElement.contains(event.target as Node)) {
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

  setPage(page: number): void {
    this.facade.setPage(page);
  }

  toggleFilterMenu(): void {
    this.filterMenuOpen.update(isOpen => !isOpen);
  }

  toggleExportMenu(): void {
    this.exportMenuOpen.update(isOpen => !isOpen);
  }

  setFilter(filter: AuditActionFilter): void {
    this.facade.setFilter(filter);
    this.filterMenuOpen.set(false);
  }

  exportPDF(): void {
    this.facade.exportPdf();
    this.exportMenuOpen.set(false);
  }

  exportExcel(): void {
    this.facade.exportExcel();
    this.exportMenuOpen.set(false);
  }
}
