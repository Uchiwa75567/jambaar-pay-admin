import { Injectable, computed, signal, inject } from '@angular/core';
import QRCode from 'qrcode';
import { DatasetStorageService } from '../../../core/services/dataset-storage.service';
import { normalizePhone } from '../../../core/utils/form-validation';

export type RestaurantPaymentStatus = 'Validé' | 'En attente' | 'Échoué';

export interface RestaurantPaymentRecord {
  id: string;
  reference: string;
  customerPhone: string;
  company: string;
  table: string;
  amount: number;
  amountLabel: string;
  date: string;
  status: RestaurantPaymentStatus;
  channel: 'QR fixe telephone' | 'Paiement manuel';
  idempotencyKey: string;
  correlationId: string;
  qrPhoneNumber: string;
  fingerprint: string;
}

export interface CreateRestaurantPaymentInput {
  customerPhone: string;
  table: string;
  amountLabel: string;
  company?: string;
  channel?: RestaurantPaymentRecord['channel'];
}

const RESTAURANT_PAYMENTS_STORAGE_KEY = 'jp_restaurant_payments_history';
const DUPLICATE_WINDOW_MS = 30 * 1000;
const QR_CODE_SIZE = 320;
const RESTAURANT_QR_PHONE_NUMBER = '771234567';

const DEFAULT_PAYMENTS: RestaurantPaymentRecord[] = [
  buildSeedPayment('PAY-240701', '+221 77 111 22 33', 'Sonatel', 'Table 4', 14_500, '2026-07-07 13:25', 'Validé'),
  buildSeedPayment('PAY-240702', '+221 77 222 33 44', 'Orange Sénégal', 'Table 12', 8_200, '2026-07-07 13:42', 'Validé'),
  buildSeedPayment('PAY-240703', '+221 77 333 44 55', 'Air Sénégal', 'Table 7', 32_000, '2026-07-07 14:05', 'En attente'),
  buildSeedPayment('PAY-240704', '+221 77 444 55 66', 'CFAO Sénégal', 'Table 3', 5_500, '2026-07-07 14:18', 'Validé'),
  buildSeedPayment('PAY-240705', '+221 77 555 66 77', 'Sonatel', 'Table 2', 12_000, '2026-07-06 12:14', 'Échoué'),
  buildSeedPayment('PAY-240706', '+221 77 666 77 88', 'SGBS', 'Table 10', 21_500, '2026-07-06 15:02', 'Validé'),
  buildSeedPayment('PAY-240707', '+221 77 777 88 99', 'Ecobank', 'Table 1', 9_500, '2026-07-06 19:30', 'Validé'),
  buildSeedPayment('PAY-240708', '+221 78 111 22 33', 'CBAO', 'Table 9', 18_000, '2026-07-05 20:10', 'En attente'),
  buildSeedPayment('PAY-240709', '+221 78 222 33 44', 'TotalEnergies', 'Table 5', 7_000, '2026-07-05 13:55', 'Validé'),
  buildSeedPayment('PAY-240710', '+221 78 333 44 55', 'UBA Sénégal', 'Table 6', 11_300, '2026-07-05 14:41', 'Échoué'),
];

@Injectable({ providedIn: 'root' })
export class RestaurantPaymentsFacade {
  private readonly datasetStorage = inject(DatasetStorageService);

  private readonly paymentsState = signal<RestaurantPaymentRecord[]>([]);

  readonly payments = computed(() => this.paymentsState());
  readonly qrPhoneNumber = computed(() => RESTAURANT_QR_PHONE_NUMBER);
  readonly qrCodeUrl = signal('');
  readonly qrCodeStatus = signal<'loading' | 'ready' | 'error'>('loading');

  constructor() {
    const storedPayments = this.datasetStorage.readArray<StoredPaymentLike>(RESTAURANT_PAYMENTS_STORAGE_KEY, DEFAULT_PAYMENTS);
    this.paymentsState.set(storedPayments.map(payment => normalizeStoredPayment(payment)));
    void this.generateQrCode();
  }

  async createPayment(input: CreateRestaurantPaymentInput): Promise<RestaurantPaymentRecord> {
    const customerPhone = normalizePhone(input.customerPhone);
    const table = input.table.trim();
    const amount = parseAmount(input.amountLabel);

    if (!customerPhone || !table || amount <= 0) {
      throw new Error('Les informations du paiement sont incomplètes.');
    }

    const alreadyPaidToday = this.findSameDayPayment(customerPhone);

    if (alreadyPaidToday) {
      throw new Error(
        `Le numero ${formatPhone(customerPhone)} a deja un paiement ${alreadyPaidToday.status.toLowerCase()} aujourd'hui. Référence ${alreadyPaidToday.reference}.`
      );
    }

    const fingerprint = [customerPhone, table.toLowerCase(), amount, RESTAURANT_QR_PHONE_NUMBER].join('|');
    const duplicate = this.findRecentDuplicate(fingerprint);

    if (duplicate) {
      throw new Error(`Une transaction proche existe déjà pour ${duplicate.table}. Référence ${duplicate.reference}.`);
    }

    const payment: RestaurantPaymentRecord = {
      id: safeUuid(),
      reference: buildReference(),
      customerPhone: formatPhone(customerPhone),
      company: input.company?.trim() || 'Scan QR partenaire',
      table,
      amount,
      amountLabel: formatAmount(amount),
      date: formatDateTime(new Date()),
      status: 'En attente',
      channel: input.channel ?? 'QR fixe telephone',
      idempotencyKey: safeUuid(),
      correlationId: safeUuid(),
      qrPhoneNumber: RESTAURANT_QR_PHONE_NUMBER,
      fingerprint,
    };

    this.persistPayments([payment, ...this.paymentsState()]);
    await wait(450);

    const finalized: RestaurantPaymentRecord = {
      ...payment,
      status: 'Validé',
    };

    this.persistPayments(
      this.paymentsState().map(current => current.id === payment.id ? finalized : current)
    );

    return finalized;
  }
  private findRecentDuplicate(fingerprint: string): RestaurantPaymentRecord | null {
    const now = Date.now();

    return this.paymentsState().find(payment => {
      if (payment.fingerprint !== fingerprint) {
        return false;
      }

      const age = now - parseDateTime(payment.date).getTime();
      return age <= DUPLICATE_WINDOW_MS && payment.status !== 'Échoué';
    }) ?? null;
  }

  private findSameDayPayment(customer: string): RestaurantPaymentRecord | null {
    const normalizedCustomerPhone = normalizePhone(customer);
    const todayKey = getDayKey(new Date());

    return this.paymentsState().find(payment =>
      normalizePhone(payment.customerPhone) === normalizedCustomerPhone
      && getDayKey(parseDateTime(payment.date)) === todayKey
      && payment.status !== 'Échoué'
    ) ?? null;
  }

  private persistPayments(payments: RestaurantPaymentRecord[]): void {
    this.paymentsState.set(payments);
    this.datasetStorage.writeArray(RESTAURANT_PAYMENTS_STORAGE_KEY, payments);
  }

  private async generateQrCode(): Promise<void> {
    try {
      const dataUrl = await QRCode.toDataURL(RESTAURANT_QR_PHONE_NUMBER, {
        errorCorrectionLevel: 'M',
        margin: 0,
        width: QR_CODE_SIZE,
      });
      this.qrCodeUrl.set(dataUrl);
      this.qrCodeStatus.set('ready');
    } catch {
      this.qrCodeStatus.set('error');
    }
  }
}

function buildSeedPayment(
  reference: string,
  customerPhone: string,
  company: string,
  table: string,
  amount: number,
  date: string,
  status: RestaurantPaymentStatus,
): RestaurantPaymentRecord {
  return {
    id: reference.toLowerCase(),
    reference,
    customerPhone: formatPhone(normalizePhone(customerPhone)),
    company,
    table,
    amount,
    amountLabel: formatAmount(amount),
    date,
    status,
    channel: 'QR fixe telephone',
    idempotencyKey: `${reference}-idem`,
    correlationId: `${reference}-corr`,
    qrPhoneNumber: RESTAURANT_QR_PHONE_NUMBER,
    fingerprint: [normalizePhone(customerPhone), table.toLowerCase(), amount, RESTAURANT_QR_PHONE_NUMBER].join('|'),
  };
}

type StoredPaymentLike = Partial<RestaurantPaymentRecord> & { customer?: string };

function safeUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function buildReference(): string {
  const date = new Date();
  const compactDate = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `PAY-${compactDate}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function formatAmount(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

function parseAmount(raw: string): number {
  const normalized = raw.replace(/[^\d.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPhone(phone: string): string {
  const normalized = normalizePhone(phone);

  if (normalized.length !== 9) {
    return phone.trim();
  }

  return `+221 ${normalized.slice(0, 2)} ${normalized.slice(2, 5)} ${normalized.slice(5, 7)} ${normalized.slice(7, 9)}`;
}

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function parseDateTime(value: string): Date {
  return new Date(value.replace(' ', 'T'));
}

function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function normalizeStoredPayment(payment: StoredPaymentLike): RestaurantPaymentRecord {
  const rawPhone = typeof payment.customerPhone === 'string'
    ? payment.customerPhone
    : typeof payment.customer === 'string'
      ? payment.customer
      : '';
  const normalizedPhone = normalizePhone(rawPhone);
  const displayPhone = normalizedPhone ? formatPhone(normalizedPhone) : rawPhone;

  return {
    id: payment.id ?? safeUuid(),
    reference: payment.reference ?? buildReference(),
    customerPhone: displayPhone,
    company: payment.company ?? 'Scan QR partenaire',
    table: payment.table ?? 'Table inconnue',
    amount: typeof payment.amount === 'number' ? payment.amount : parseAmount(String(payment.amountLabel ?? '0')),
    amountLabel: typeof payment.amountLabel === 'string' && payment.amountLabel
      ? payment.amountLabel
      : formatAmount(typeof payment.amount === 'number' ? payment.amount : 0),
    date: payment.date ?? formatDateTime(new Date()),
    status: payment.status ?? 'Validé',
    channel: payment.channel ?? 'QR fixe telephone',
    idempotencyKey: payment.idempotencyKey ?? safeUuid(),
    correlationId: payment.correlationId ?? safeUuid(),
    qrPhoneNumber: payment.qrPhoneNumber ?? RESTAURANT_QR_PHONE_NUMBER,
    fingerprint: payment.fingerprint ?? [normalizedPhone, (payment.table ?? '').toLowerCase(), typeof payment.amount === 'number' ? payment.amount : parseAmount(String(payment.amountLabel ?? '0')), RESTAURANT_QR_PHONE_NUMBER].join('|'),
  };
}

function wait(durationMs: number): Promise<void> {
  return new Promise(resolve => window.setTimeout(resolve, durationMs));
}
