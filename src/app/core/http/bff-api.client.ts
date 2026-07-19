import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { map, Observable, timeout } from 'rxjs';
import { BFF_API_URL } from './bff-api.config';
import { ApiEnvelope, ApiQuery, ApiQueryValue } from './models/api-response';

export const BFF_REQUEST_TIMEOUT = new InjectionToken<number>('BFF_REQUEST_TIMEOUT', {
  providedIn: 'root',
  factory: () => 15_000,
});

@Injectable({ providedIn: 'root' })
export class BffApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(BFF_API_URL);
  private readonly requestTimeout = inject(BFF_REQUEST_TIMEOUT);

  get<T>(path: string, query?: ApiQuery): Observable<T> {
    return this.http.get<ApiEnvelope<T>>(this.buildUrl(path), {
      params: this.buildParams(query),
      withCredentials: true,
    }).pipe(
      timeout(this.requestTimeout),
      map(response => response.data),
    );
  }

  post<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http.post<ApiEnvelope<TResponse>>(this.buildUrl(path), body, {
      withCredentials: true,
    }).pipe(
      timeout(this.requestTimeout),
      map(response => response.data),
    );
  }

  put<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http.put<ApiEnvelope<TResponse>>(this.buildUrl(path), body, {
      withCredentials: true,
    }).pipe(
      timeout(this.requestTimeout),
      map(response => response.data),
    );
  }

  patch<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http.patch<ApiEnvelope<TResponse>>(this.buildUrl(path), body, {
      withCredentials: true,
    }).pipe(
      timeout(this.requestTimeout),
      map(response => response.data),
    );
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.http.delete<ApiEnvelope<TResponse>>(this.buildUrl(path), {
      withCredentials: true,
    }).pipe(
      timeout(this.requestTimeout),
      map(response => response.data),
    );
  }

  private buildUrl(path: string): string {
    if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith('//')) {
      throw new Error('BffApiClient only accepts relative endpoint paths.');
    }

    const baseUrl = this.baseUrl.replace(/\/+$/, '');
    const endpoint = path.replace(/^\/+/, '');
    return endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
  }

  private buildParams(query?: ApiQuery): HttpParams {
    let params = new HttpParams();

    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value == null) return;

      const values: readonly ApiQueryValue[] = Array.isArray(value) ? value : [value];
      values.forEach(item => {
        params = params.append(key, String(item));
      });
    });

    return params;
  }
}
