import { expect, test } from '@playwright/test';

import { mockApi } from './api-mock';
import { mockKeycloak } from './keycloak-mock';

test.beforeEach(async ({ page, browserName }) => {
  await mockKeycloak(page, browserName);
  await mockApi(page);
});

test.describe('Dashboard Page', () => {
  test('should display the dashboard header', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Mes CVs' })).toBeVisible();
    await expect(page.getByText('Créez, modifiez et partagez vos CVs')).toBeVisible();
  });

  test('should display the resume list', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('CV number 1')).toBeVisible();
  });

  test('should display public and shared badges', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Public')).toBeVisible();
    await expect(page.getByText('Partagé')).toBeVisible();
  });

  test('should display the footer', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Tous droits réservés')).toBeVisible();
  });
});

test.describe('Navbar', () => {
  test('should display the logout button', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('should display the logo link', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link')).toBeVisible();
  });

  test('should not display public navigation anchors', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Projets' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'CV' })).not.toBeVisible();
  });
});

test.describe('Create CV dialog', () => {
  test('should open the create dialog when clicking "Nouveau CV"', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Nouveau CV' }).click();

    await expect(page.getByPlaceholder('Titre du CV...')).toBeVisible();
  });

  test('should close the dialog when clicking "Annuler"', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Nouveau CV' }).click();
    await page.getByRole('button', { name: 'Annuler' }).click();

    await expect(page.getByPlaceholder('Titre du CV...')).not.toBeVisible();
  });

  test('should disable "Créer" button when title is empty', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Nouveau CV' }).click();

    await expect(page.getByRole('button', { name: 'Créer' })).toBeDisabled();
  });

  test('should enable "Créer" button when title is filled', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Nouveau CV' }).click();
    await page.getByPlaceholder('Titre du CV...').fill('Mon nouveau CV');

    await expect(page.getByRole('button', { name: 'Créer' })).toBeEnabled();
  });
});

test.describe('Navigation', () => {
  test('should redirect unknown routes to dashboard', async ({ page }) => {
    await page.goto('/unknown-page');

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Mes CVs' })).toBeVisible();
  });
});
