export interface PlatformSettings {
  platformName: string;
  address: string;
  supportPhone: string;
  maxTransactionAmount: string;
  maxTransactionsPerDay: string;
}

export function createEmptyPlatformSettings(): PlatformSettings {
  return {
    platformName: '',
    address: '',
    supportPhone: '',
    maxTransactionAmount: '',
    maxTransactionsPerDay: '',
  };
}
