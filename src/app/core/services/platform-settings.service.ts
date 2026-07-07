import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface PlatformSettings {
  platformName: string;
  address: string;
  supportPhone: string;
  maxTransactionAmount: string;
  maxTransactionsPerDay: string;
}

const PLATFORM_SETTINGS_KEY = 'jp_platform_settings';

const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: '',
  address: '',
  supportPhone: '',
  maxTransactionAmount: '',
  maxTransactionsPerDay: '',
};

@Injectable({ providedIn: 'root' })
export class PlatformSettingsService {
  constructor(private readonly storage: StorageService) {}

  read(): PlatformSettings {
    const raw = this.storage.get(PLATFORM_SETTINGS_KEY);

    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PlatformSettings>;
      return {
        platformName: typeof parsed.platformName === 'string' ? parsed.platformName : DEFAULT_SETTINGS.platformName,
        address: typeof parsed.address === 'string' ? parsed.address : DEFAULT_SETTINGS.address,
        supportPhone: typeof parsed.supportPhone === 'string' ? parsed.supportPhone : DEFAULT_SETTINGS.supportPhone,
        maxTransactionAmount: typeof parsed.maxTransactionAmount === 'string' ? parsed.maxTransactionAmount : DEFAULT_SETTINGS.maxTransactionAmount,
        maxTransactionsPerDay: typeof parsed.maxTransactionsPerDay === 'string' ? parsed.maxTransactionsPerDay : DEFAULT_SETTINGS.maxTransactionsPerDay,
      };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  save(settings: PlatformSettings): void {
    this.storage.set(PLATFORM_SETTINGS_KEY, JSON.stringify(settings));
  }
}
