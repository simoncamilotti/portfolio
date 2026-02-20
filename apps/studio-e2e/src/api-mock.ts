import type { Page } from '@playwright/test';

const MOCK_RESUMES = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    title: 'CV number 1',
    description: 'My first resume',
    isPublic: true,
    shareEnabled: true,
    updatedAt: '2026-02-01T12:00:00.000Z',
    views: 42,
    downloads: 7,
  },
];

/**
 * Intercepts all API requests and returns mock data.
 * Must be called before any page navigation.
 */
export async function mockApi(page: Page): Promise<void> {
  await page.route('**/api/resumes', route => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_RESUMES),
      });
    }

    return route.continue();
  });
}
