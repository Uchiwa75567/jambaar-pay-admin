import { isBffRequest } from './bff-api.config';

describe('BFF API config', () => {
  it('recognizes only requests under the configured BFF boundary', () => {
    expect(isBffRequest('/bff', '/bff')).toBeTrue();
    expect(isBffRequest('/bff/companies', '/bff')).toBeTrue();
    expect(isBffRequest('/bff-malicious/companies', '/bff')).toBeFalse();
    expect(isBffRequest('https://third-party.example/api', '/bff')).toBeFalse();
  });

  it('supports an absolute BFF URL', () => {
    const bffUrl = 'https://bff.jambaarpay.sn/api';

    expect(isBffRequest(`${bffUrl}/transactions`, bffUrl)).toBeTrue();
    expect(isBffRequest('https://bff.jambaarpay.sn/other', bffUrl)).toBeFalse();
  });
});
