import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BffApiClient } from '../../../core/http/bff-api.client';
import { PlatformSettingsRepository } from '../application/platform-settings.repository';
import { PlatformSettings } from '../domain/platform-settings.model';

@Injectable({ providedIn: 'root' })
export class BffPlatformSettingsRepository implements PlatformSettingsRepository {
  private readonly api = inject(BffApiClient);

  read(): Observable<PlatformSettings> {
    return this.api.get<PlatformSettings>('settings/platform');
  }

  save(settings: PlatformSettings): Observable<void> {
    return this.api.put<void, PlatformSettings>('settings/platform', settings);
  }
}
