import { defineConfig, devices } from '@playwright/test';

// UI integration tests: the production build of the client, with the API (api-mock.ts) mocked by the tests
// themselves.
const webUrl = 'http://localhost:4200';
const ci = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './src',
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
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    // The binary itself, not through pnpm: Playwright must be able to stop it.
    command: '../../node_modules/.bin/vite preview --port 4200 --strictPort',
    cwd: '../client',
    url: webUrl,
    reuseExistingServer: !ci,
    // Served as /config.js by the runtime-config plugin of the client: no reCAPTCHA, no analytics.
    env: {
      WEB_API_URL: webUrl,
      WEB_RECAPTCHA_SITE_KEY: '',
      WEB_UMAMI_SRC: '',
      WEB_UMAMI_WEBSITE_ID: '',
    },
  },
});
