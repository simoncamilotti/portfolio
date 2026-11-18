import { getConfig, loadConfig } from './config.js';

const valid = {
  apiUrl: 'https://cv.example.com',
  recaptchaSiteKey: 'site-key',
  umami: { src: '', websiteId: '' },
};

describe('loadConfig', () => {
  afterEach(() => {
    delete window.__APP_CONFIG__;
  });

  it('should read and keep a valid configuration', () => {
    window.__APP_CONFIG__ = valid;

    expect(loadConfig()).toEqual(valid);
    expect(getConfig()).toEqual(valid);
  });

  it('should reject a missing configuration', () => {
    expect(() => loadConfig()).toThrow('Invalid /config.js');
  });

  it('should reject an API URL that is not a URL', () => {
    window.__APP_CONFIG__ = { ...valid, apiUrl: '' };

    expect(() => loadConfig()).toThrow('apiUrl');
  });
});
