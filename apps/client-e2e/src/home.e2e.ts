import { expect, test } from '@playwright/test';

import { createProject, setFeatureFlag, uniqueTitle } from './api.js';

test.describe('home page', () => {
  test('displays the hero, the navigation, the CV and the footer', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Software Engineer');
    await expect(page.getByRole('link', { name: 'CV', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
    await expect(page.getByText('Curriculum Vitae')).toBeVisible();
    await expect(page.getByText('Tous droits réservés')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeHidden();
  });

  test('shows the projects when the feature flag is enabled', async ({ page }) => {
    const title = uniqueTitle('Projet');
    await createProject(title);
    await setFeatureFlag('projects', true);

    await page.goto('/');

    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Projets', exact: true }),
    ).toBeVisible();
    await expect(page.getByText(title)).toBeVisible();
  });

  test('hides the projects when the feature flag is disabled', async ({ page }) => {
    const title = uniqueTitle('Projet');
    await createProject(title);
    await setFeatureFlag('projects', false);

    await page.goto('/');

    await expect(page.getByText('Curriculum Vitae')).toBeVisible();
    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Projets', exact: true }),
    ).toBeHidden();
    await expect(page.getByText(title)).toBeHidden();
  });

  test('sends unknown routes back home', async ({ page }) => {
    await page.goto('/unknown-page');

    await expect(page).toHaveURL('/');
  });
});
