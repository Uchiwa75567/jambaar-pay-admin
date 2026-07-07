export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const NINEA_PATTERN = /^[A-Za-z0-9/-]{6,20}$/;

export function hasValue(value: string | number | null | undefined): boolean {
  return !!String(value ?? '').trim();
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('221') && digits.length > 9 ? digits.slice(3) : digits;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidSenegalPhone(value: string): boolean {
  const normalized = normalizePhone(value);
  return /^7\d{8}$/.test(normalized);
}

export function isValidNinea(value: string): boolean {
  return NINEA_PATTERN.test(value.trim());
}

export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

export function isPositiveNumber(value: string | number): boolean {
  const normalized = String(value ?? '').replace(/[^\d.,-]/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0;
}

export function isPositiveInteger(value: string | number): boolean {
  const normalized = String(value ?? '').trim();
  const parsed = Number(normalized);
  return Number.isInteger(parsed) && parsed > 0;
}

export function isStrongPassword(value: string): boolean {
  return PASSWORD_PATTERN.test(value);
}
