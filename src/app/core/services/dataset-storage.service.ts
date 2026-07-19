import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class DatasetStorageService {
  private storage = inject(StorageService);


  readArray<T>(key: string, fallback: T[]): T[] {
    const raw = this.storage.get(key);

    if (!raw) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed as T[] : fallback;
    } catch {
      return fallback;
    }
  }

  writeArray<T>(key: string, value: readonly T[]): void {
    this.storage.set(key, JSON.stringify(value));
  }
}
