import { z } from 'zod';

const configSchema = z.object({
  /** Origin of the API, e.g. `http://localhost:3000`. */
  apiUrl: z.url(),
  /** Empty: the contact form sends no reCAPTCHA token (local development, tests). */
  recaptchaSiteKey: z.string(),
  /** Empty: no analytics. */
  umami: z.object({
    src: z.union([z.url(), z.literal('')]),
    websiteId: z.string(),
  }),
});

export type AppConfig = z.infer<typeof configSchema>;

declare global {
  interface Window {
    __APP_CONFIG__?: unknown;
  }
}

let current: AppConfig | undefined;

/** Reads `/config.js`, generated when the container starts. */
export function loadConfig(): AppConfig {
  const result = configSchema.safeParse(window.__APP_CONFIG__);
  if (!result.success) {
    throw new Error(`Invalid /config.js:\n${z.prettifyError(result.error)}`);
  }
  current = result.data;
  return current;
}

/** The configuration read at startup by `loadConfig()`. */
export function getConfig(): AppConfig {
  if (!current) {
    throw new Error('loadConfig() must be called first');
  }
  return current;
}
