import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { PlatformSettingsRepository } from '../application/platform-settings.repository';
import { createEmptyPlatformSettings, PlatformSettings } from '../domain/platform-settings.model';

const STORAGE_KEY = 'jp_platform_settings';

@Injectable({ providedIn: 'root' })
export class LocalPlatformSettingsRepository implements PlatformSettingsRepository {
  private readonly storage = inject(StorageService);

  read(): Observable<PlatformSettings> {
    const fallback = createEmptyPlatformSettings();
    const raw = this.storage.get(STORAGE_KEY);

    if (!raw) return of(fallback);

    try {
      const parsed = JSON.parse(raw) as Partial<PlatformSettings>;
      return of({
        platformName: typeof parsed.platformName === 'string' ? parsed.platformName : fallback.platformName,
        address: typeof parsed.address === 'string' ? parsed.address : fallback.address,
        supportPhone: typeof parsed.supportPhone === 'string' ? parsed.supportPhone : fallback.supportPhone,
        maxTransactionAmount: typeof parsed.maxTransactionAmount === 'string' ? parsed.maxTransactionAmount : fallback.maxTransactionAmount,
        maxTransactionsPerDay: typeof parsed.maxTransactionsPerDay === 'string' ? parsed.maxTransactionsPerDay : fallback.maxTransactionsPerDay,
      });
    } catch {
      return of(fallback);
    }
  }

  save(settings: PlatformSettings): Observable<void> {
    this.storage.set(STORAGE_KEY, JSON.stringify(settings));
    return of(undefined);
  }
}
