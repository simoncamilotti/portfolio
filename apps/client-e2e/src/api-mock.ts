import type { Page } from '@playwright/test';

type FeatureFlagOverrides = {
  projects?: boolean;
};

/**
 * Intercepts API requests and returns mock data.
 * Must be called before any page navigation.
 */
export async function mockApi(page: Page, featureFlags?: FeatureFlagOverrides): Promise<void> {
  await page.route('**/api/feature-flags', route => {
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
