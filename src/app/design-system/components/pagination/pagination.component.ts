import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { buildVisiblePages } from '../../../core/utils/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageSizeOptions = input<readonly number[]>([5, 10, 20]);
  readonly ariaLabel = input('Pagination');

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly visiblePages = computed(() =>
    buildVisiblePages(Math.max(1, this.totalPages()), this.currentPage())
  );

  selectPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  previousPage(): void {
    this.selectPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.selectPage(this.currentPage() + 1);
  }

  selectPageSize(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value);

    if (this.pageSizeOptions().includes(size) && size !== this.pageSize()) {
      this.pageSizeChange.emit(size);
    }
  }
}
