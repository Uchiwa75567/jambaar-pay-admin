import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformSettings } from '../domain/platform-settings.model';

export interface PlatformSettingsRepository {
  read(): Observable<PlatformSettings>;
  save(settings: PlatformSettings): Observable<void>;
}

export const PLATFORM_SETTINGS_REPOSITORY = new InjectionToken<PlatformSettingsRepository>('PLATFORM_SETTINGS_REPOSITORY');
