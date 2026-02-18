import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the hero section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Software Engineer');
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projets', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CV', exact: true })).toBeVisible();
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
  test('should redirect unknown routes to home', async ({ page }) => {
    await page.goto('/unknown-page');

    await expect(page).toHaveURL('/');
  });

  test('should not display a dashboard link', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeHidden();
  });
});
