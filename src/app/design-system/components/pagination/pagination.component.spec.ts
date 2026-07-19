import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
  });

  it('emits only valid page changes', () => {
    const emittedPages: number[] = [];
    component.pageChange.subscribe(page => emittedPages.push(page));

    component.previousPage();
    component.nextPage();
    component.selectPage(2);
    component.selectPage(0);
    component.selectPage(6);

    expect(emittedPages).toEqual([1, 3]);
  });

  it('emits an allowed page size and ignores invalid values', () => {
    const emittedSizes: number[] = [];
    component.pageSizeChange.subscribe(size => emittedSizes.push(size));

    component.selectPageSize({ target: { value: '20' } } as unknown as Event);
    component.selectPageSize({ target: { value: '7' } } as unknown as Event);
    component.selectPageSize({ target: { value: '10' } } as unknown as Event);

    expect(emittedSizes).toEqual([20]);
  });

  it('renders accessible navigation controls', () => {
    const navigation = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const activePage = fixture.nativeElement.querySelector('[aria-current="page"]') as HTMLButtonElement;

    expect(navigation.getAttribute('aria-label')).toBe('Pagination');
    expect(activePage.textContent?.trim()).toBe('02');
  });
});
