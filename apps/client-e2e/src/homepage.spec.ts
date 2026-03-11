import { expect, test } from '@playwright/test';

import { mockApi } from './api-mock';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test.describe('Home Page', () => {
  test('should display the hero section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Software Engineer');
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: 'CV', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
  });

  test('should display the Projets nav link when feature flag is enabled', async ({ page }) => {
    await mockApi(page, { projects: true });
    await page.goto('/');

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Projets', exact: true })).toBeVisible();
  });

  test('should hide the Projets nav link when feature flag is disabled', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Projets', exact: true })).toBeHidden();
  });

  test('should display the CV section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Curriculum Vitae')).toBeVisible();
  });

  test('should display the footer', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Tous droits réservés')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should redirect unknown routes to home', async ({ page }) => {
    await page.goto('/unknown-page');

    await expect(page).toHaveURL('/');
  });

  test('should not display a dashboard link', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeHidden();
  });
});
