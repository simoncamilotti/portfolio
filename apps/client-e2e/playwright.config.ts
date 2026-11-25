import { defineConfig, devices } from '@playwright/test';
import { readE2eEnv } from '@repo/e2e-support';

// Full-stack e2e (starter ADR 0010): the production build of the client against the production
// build of the API and a real database.
const env = readE2eEnv();
const webUrl = `http://localhost:${env.E2E_WEB_PORT}`;
const ci = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.e2e.ts',
  globalSetup: './src/global-setup.ts',
  // One worker, retries and long timeouts: the CI runners are shared.
  workers: 1,
  retries: ci ? 2 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: ci ? [['list'], ['html', { open: 'never' }]] : 'list',
  outputDir: './test-output/results',
  use: {
    baseURL: webUrl,
    locale: 'fr-FR',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // The binary itself, not through pnpm: Playwright must be able to stop it.
    command: `../../node_modules/.bin/vite preview --port ${env.E2E_WEB_PORT} --strictPort`,
    cwd: '../client',
    url: webUrl,
    reuseExistingServer: !ci,
    // Served as /config.js by the runtime-config plugin: no reCAPTCHA, no analytics.
    env: {
      WEB_API_URL: `http://localhost:${env.E2E_API_PORT}`,
      WEB_RECAPTCHA_SITE_KEY: '',
      WEB_UMAMI_SRC: '',
      WEB_UMAMI_WEBSITE_ID: '',
    },
  },
});
