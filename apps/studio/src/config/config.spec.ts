import { loadConfig } from './config.js';

const valid = {
  apiUrl: 'https://studio.example.com',
  oidc: { authority: 'https://sso.example.com/realms/test', clientId: 'studio' },
};

describe('loadConfig', () => {
  afterEach(() => {
    delete window.__APP_CONFIG__;
  });

  it('should read a valid configuration', () => {
    window.__APP_CONFIG__ = valid;

    expect(loadConfig()).toEqual(valid);
  });

  it('should reject a missing client id', () => {
    window.__APP_CONFIG__ = { ...valid, oidc: { ...valid.oidc, clientId: '' } };

    expect(() => loadConfig()).toThrow('clientId');
  });
});
