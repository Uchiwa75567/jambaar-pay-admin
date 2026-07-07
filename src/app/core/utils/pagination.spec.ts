import { buildVisiblePages, sliceCurrentPage } from './pagination';

describe('pagination utils', () => {
  it('builds compact visible pages around the current page', () => {
    expect(buildVisiblePages(10, 1)).toEqual([1, 2, 3, '...', 10]);
    expect(buildVisiblePages(10, 5)).toEqual([1, '...', 4, 5, 6, '...', 10]);
    expect(buildVisiblePages(10, 9)).toEqual([1, '...', 8, 9, 10]);
  });

  it('slices the current page safely', () => {
    const items = [1, 2, 3, 4, 5, 6, 7];

    expect(sliceCurrentPage(items, 1, 3)).toEqual([1, 2, 3]);
    expect(sliceCurrentPage(items, 3, 3)).toEqual([7]);
    expect(sliceCurrentPage(items, 0, 0)).toEqual([1]);
  });
});
