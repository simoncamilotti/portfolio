import { expect, test } from '@playwright/test';

import { mockKeycloak } from './keycloak-mock';

test.beforeEach(async ({ page, browserName }) => {
  await mockKeycloak(page, browserName);
});

test.describe('Home Page', () => {
  test('should display the hero section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Software Engineer');
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });

  test('should display the projects section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Projets' })).toBeVisible();
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
  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Dashboard' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Mes CVs' })).toBeVisible();
  });

  test('should redirect unknown routes to home', async ({ page }) => {
    await page.goto('/unknown-page');

    await expect(page).toHaveURL('/');
  });
});

test.describe('Dashboard', () => {
  test('should display the dashboard header', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Mes CVs' })).toBeVisible();
    await expect(page.getByText('Créez, modifiez et partagez vos CVs')).toBeVisible();
  });

  test('should open the create CV dialog', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('button', { name: 'Nouveau CV' }).click();

    await expect(page.getByPlaceholder('Titre du CV...')).toBeVisible();
  });
});
