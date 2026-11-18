import { expect, test } from '@playwright/test';

import { mockApi } from './api-mock.js';
import { mockOidc } from './oidc-mock.js';

test.beforeEach(async ({ page }) => {
  await mockOidc(page);
  await mockApi(page);
});

test.describe('Navigation', () => {
  test('should redirect unknown routes to home', async ({ page }) => {
    await page.goto('/unknown');

    await expect(page).toHaveURL('/');
  });

  test('should open a resume from the list', async ({ page }) => {
    await page.goto('/resumes');

    await page.getByText('CV number 1').click();

    await expect(page).toHaveURL('/resumes/00000000-0000-0000-0000-000000000001');
    await expect(page.getByText('Cv - CV number 1')).toBeVisible();
  });

  test('should come back to the requested page after signing in', async ({ page }) => {
    await page.goto('/settings');

    await expect(page).toHaveURL('/settings');
  });
});
