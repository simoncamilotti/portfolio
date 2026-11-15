import type { Page } from '@playwright/test';

type FeatureFlagOverrides = {
  projects?: boolean;
};

/**
 * Intercepts API requests and returns mock data.
 * Must be called before any page navigation.
 */
export async function mockApi(page: Page, featureFlags?: FeatureFlagOverrides): Promise<void> {
  // /config.js is not versioned (config/client/config.example.js): serve one without reCAPTCHA
  // nor analytics.
  await page.route('**/config.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `window.config = {
        captcha: { siteKey: '' },
        umami: { src: 'data:text/javascript,', websiteId: '' },
      };`,
    }),
  );

  await page.route('**/api/feature-flags', (route) => {
    if (route.request().method() === 'GET') {
      const flags = [{ key: 'projects', enabled: featureFlags?.projects ?? false }];

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(flags),
      });
    }

    return route.continue();
  });
}
