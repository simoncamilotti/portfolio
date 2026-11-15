import { z } from 'zod';

const commaSeparatedList = z
  .string()
  .default('')
  .transform((value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );

/** Environment variables of the API. Documented in `.env.example`. */
const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    /** Dates are stored and compared in UTC: any other time zone would shift them. */
    TZ: z.literal('Etc/UTC', { error: 'TZ must be Etc/UTC: dates are stored in UTC' }),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    /** OIDC issuer, e.g. `http://localhost:8081/realms/portfolio`. Its keys are found by discovery. */
    OIDC_ISSUER_URL: z.url(),
    /** Expected `aud` claim of the access tokens. */
    OIDC_AUDIENCE: z.string().min(1),
    /** Origins allowed to call the API from a browser, comma-separated. */
    CORS_ORIGINS: commaSeparatedList,
    /** SMTP server of the contact form. Port 465 uses implicit TLS, the others STARTTLS or none. */
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive().default(465),
    SMTP_USER: z.string().default(''),
    SMTP_PASS: z.string().default(''),
    SMTP_FROM: z.string().min(1),
    /** Recipient of the contact form messages. */
    CONTACT_EMAIL_TO: z.string().min(1),
    RECAPTCHA_SECRET_KEY: z.string().min(1),
  })
  .refine((env) => env.NODE_ENV !== 'production' || env.CORS_ORIGINS.length > 0, {
    message: 'CORS_ORIGINS is required in production: without it the browser cannot call the API',
    path: ['CORS_ORIGINS'],
  });

export type Env = z.infer<typeof envSchema>;

/** Validates the environment at startup: the API refuses to start with an invalid configuration. */
export function validateEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
