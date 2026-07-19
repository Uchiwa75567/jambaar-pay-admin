import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatasetStorageService } from '../../../core/services/dataset-storage.service';
import { StorageService } from '../../../core/services/storage.service';
import { RestaurantPaymentsFacade } from './restaurant-payments.facade';

describe('RestaurantPaymentsFacade', () => {
  let service: RestaurantPaymentsFacade;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [RestaurantPaymentsFacade, DatasetStorageService, StorageService],
    });

    service = TestBed.inject(RestaurantPaymentsFacade);
  });

  it('creates a payment and persists it in history', fakeAsync(() => {
    let createdReference = '';

    service.createPayment({
      customerPhone: '77 999 88 77',
      table: 'Table 1',
      amountLabel: '12 500 FCFA',
    }).then(payment => {
      createdReference = payment.reference;
      expect(payment.status).toBe('Validé');
      expect(payment.customerPhone).toBe('+221 77 999 88 77');
    });

    tick(500);

    expect(createdReference).toContain('PAY-');
    expect(service.payments().some(payment => payment.reference === createdReference)).toBeTrue();
  }));

  it('rejects an immediate duplicate payment for the same QR session', fakeAsync(() => {
    let duplicateMessage = '';

    service.createPayment({
      customerPhone: '77 888 77 66',
      table: 'Table 2',
      amountLabel: '9 000 FCFA',
    });

    service.createPayment({
      customerPhone: '+221 77 888 77 66',
      table: 'Table 2',
      amountLabel: '9 000 FCFA',
    }).catch(error => {
      duplicateMessage = error instanceof Error ? error.message : '';
    });

    tick();
    tick(500);

    expect(duplicateMessage).toContain('a deja un paiement');
  }));

  it('rejects a second payment from the same user on the same day', fakeAsync(() => {
    let duplicateDayMessage = '';

    service.createPayment({
      customerPhone: '78 555 44 33',
      table: 'Table 5',
      amountLabel: '15 000 FCFA',
    });

    tick(500);

    service.createPayment({
      customerPhone: '+221785554433',
      table: 'Table 9',
      amountLabel: '18 000 FCFA',
    }).catch(error => {
      duplicateDayMessage = error instanceof Error ? error.message : '';
    });

    tick();

    expect(duplicateDayMessage).toContain('a deja un paiement');
  }));
});
