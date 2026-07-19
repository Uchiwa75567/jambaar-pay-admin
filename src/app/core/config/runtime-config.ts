import { InjectionToken } from '@angular/core';

export type DataSourceMode = 'local' | 'bff';

export interface AppRuntimeConfig {
  dataSource: DataSourceMode;
  bffApiUrl: string;
}

export const APP_RUNTIME_CONFIG = new InjectionToken<AppRuntimeConfig>('APP_RUNTIME_CONFIG', {
  providedIn: 'root',
  factory: readRuntimeConfig,
});

export function selectRepository<T>(config: AppRuntimeConfig, local: T, bff: T): T {
  return config.dataSource === 'bff' ? bff : local;
}

function readRuntimeConfig(): AppRuntimeConfig {
  const dataSource = readMeta('jambaar-data-source');
  const bffApiUrl = readMeta('jambaar-bff-api-url');

  return {
    dataSource: dataSource === 'bff' ? 'bff' : 'local',
    bffApiUrl: bffApiUrl || '/bff',
  };
}

function readMeta(name: string): string {
  if (typeof document === 'undefined') return '';
  return document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content.trim() ?? '';
}
