export type VisiblePageItem = number | '...';

export function buildVisiblePages(totalPages: number, currentPage: number): VisiblePageItem[] {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export function sliceCurrentPage<T>(items: T[], currentPage: number, pageSize: number): T[] {
  const safePageSize = Math.max(1, pageSize);
  const safePage = Math.max(1, currentPage);
  const start = (safePage - 1) * safePageSize;
  return items.slice(start, start + safePageSize);
}
