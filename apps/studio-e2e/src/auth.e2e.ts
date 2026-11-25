import { uniqueUser } from '@repo/e2e-support';

import { expect, test } from './fixtures.js';

test('sends a signed-out visitor to the identity provider', async ({ page }) => {
  await page.goto('/settings');

  await page.waitForURL(/\/authorize\?/);
  expect(new URL(page.url()).searchParams.get('client_id')).toBe('web');
});

test.describe('signed in', () => {
  test.beforeEach(async ({ signIn }) => {
    await signIn(uniqueUser());
  });

  test('opens the requested page', async ({ page }) => {
    await page.goto('/settings');

    await expect(page).toHaveURL('/settings');
  });

  test('displays the navbar', async ({ page }) => {
    await page.goto('/resumes');

    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link').first()).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Accueil' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Projets' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Paramétrage' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Déconnexion' })).toBeVisible();
  });

  test('sends unknown routes back home', async ({ page }) => {
    await page.goto('/unknown-page');

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Homepage')).toBeVisible();
  });
});
