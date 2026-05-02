import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get(key: string, session = false): string | null {
    const store = session ? sessionStorage : localStorage;
    return store.getItem(key);
  }

  set(key: string, value: string, session = false): void {
    const store = session ? sessionStorage : localStorage;
    store.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
}
