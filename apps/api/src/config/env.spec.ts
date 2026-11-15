import { validateEnv } from './env.js';

const required = {
  TZ: 'Etc/UTC',
  DATABASE_URL: 'postgresql://app:app@localhost:5432/app',
  OIDC_ISSUER_URL: 'http://localhost:8080/realms/app',
  OIDC_AUDIENCE: 'api',
  SMTP_HOST: 'smtp.example.com',
  SMTP_FROM: 'portfolio@example.com',
  CONTACT_EMAIL_TO: 'me@example.com',
  RECAPTCHA_SECRET_KEY: 'secret',
};

describe('validateEnv', () => {
  it('applies the defaults', () => {
    expect(validateEnv(required)).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      LOG_LEVEL: 'info',
      CORS_ORIGINS: [],
      SMTP_PORT: 465,
      SMTP_USER: '',
      SMTP_PASS: '',
    });
  });

  it('splits the CORS origins', () => {
    expect(
      validateEnv({ ...required, CORS_ORIGINS: 'http://a.test, http://b.test' }).CORS_ORIGINS,
    ).toEqual(['http://a.test', 'http://b.test']);
  });

  it('requires a PostgreSQL database URL', () => {
    expect(() => validateEnv({ ...required, DATABASE_URL: 'mysql://localhost/app' })).toThrow(
      /DATABASE_URL/,
    );
  });

  it('refuses any time zone but UTC', () => {
    expect(() => validateEnv({ ...required, TZ: 'Europe/Paris' })).toThrow(/TZ/);
  });

  it('requires the CORS origins in production', () => {
    expect(() => validateEnv({ ...required, NODE_ENV: 'production' })).toThrow(/CORS_ORIGINS/);
  });

  it('requires the reCAPTCHA secret', () => {
    const { RECAPTCHA_SECRET_KEY: _omitted, ...withoutSecret } = required;
    expect(() => validateEnv(withoutSecret)).toThrow(/RECAPTCHA_SECRET_KEY/);
  });

  it('rejects an invalid value with a readable message', () => {
    expect(() => validateEnv({ ...required, PORT: 'abc' })).toThrow(/PORT/);
  });
});
