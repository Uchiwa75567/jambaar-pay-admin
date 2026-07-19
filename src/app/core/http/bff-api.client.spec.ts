import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BFF_API_URL } from './bff-api.config';
import { BffApiClient } from './bff-api.client';

describe('BffApiClient', () => {
  let client: BffApiClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BFF_API_URL, useValue: '/bff' },
      ],
    });

    client = TestBed.inject(BffApiClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('unwraps the API envelope and serializes query values', () => {
    let result: readonly string[] = [];

    client.get<string[]>('companies', {
      page: 2,
      active: true,
      tag: ['priority', 'dakar'],
      ignored: null,
    }).subscribe(data => result = data);

    const request = httpTesting.expectOne(candidate => candidate.url === '/bff/companies');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeTrue();
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('active')).toBe('true');
    expect(request.request.params.getAll('tag')).toEqual(['priority', 'dakar']);
    expect(request.request.params.has('ignored')).toBeFalse();

    request.flush({ data: ['Sonatel'] });
    expect(result).toEqual(['Sonatel']);
  });

  it('sends a typed body through the BFF boundary', () => {
    const body = { name: 'Le Djolof' };
    let createdId = '';

    client.post<{ id: string }, typeof body>('restaurants', body)
      .subscribe(response => createdId = response.id);

    const request = httpTesting.expectOne('/bff/restaurants');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    expect(request.request.withCredentials).toBeTrue();

    request.flush({ data: { id: 'restaurant-1' } });
    expect(createdId).toBe('restaurant-1');
  });

  it('rejects absolute endpoints so calls cannot bypass the BFF', () => {
    expect(() => client.get('https://third-party.example/companies'))
      .toThrowError('BffApiClient only accepts relative endpoint paths.');
    expect(() => client.get('//third-party.example/companies'))
      .toThrowError('BffApiClient only accepts relative endpoint paths.');
  });
});
