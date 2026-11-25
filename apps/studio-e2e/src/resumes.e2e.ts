import { uniqueUser } from '@repo/e2e-support';

import { createResume, uniqueTitle } from './api.js';
import { expect, test } from './fixtures.js';

test.beforeEach(async ({ signIn }) => {
  await signIn(uniqueUser());
});

test.describe('resumes page', () => {
  test('displays the header, the created resume and the footer', async ({ page }) => {
    const resume = await createResume(uniqueTitle('CV'));

    await page.goto('/resumes');

    await expect(page.getByRole('heading', { name: 'Mes CVs' })).toBeVisible();
    await expect(page.getByText('Créez, modifiez et partagez vos CVs')).toBeVisible();
    await expect(page.getByText(resume.title)).toBeVisible();
    await expect(page.getByText('Tous droits réservés')).toBeVisible();
  });

  test('marks the public resume only', async ({ page }) => {
    const draft = await createResume(uniqueTitle('CV brouillon'));
    const published = await createResume(uniqueTitle('CV public'), { isPublic: true });

    await page.goto('/resumes');

    // Each resume of the list is a link around its title.
    const item = (title: string) =>
      page.getByRole('link').filter({ has: page.getByRole('heading', { name: title }) });
    await expect(item(published.title)).toContainText('Public');
    await expect(item(draft.title)).toBeVisible();
    await expect(item(draft.title)).not.toContainText('Public');
  });

  test('opens a resume from the list', async ({ page }) => {
    const resume = await createResume(uniqueTitle('CV'));

    await page.goto('/resumes');
    await page.getByText(resume.title).click();

    await expect(page).toHaveURL(`/resumes/${resume.id}`);
    await expect(page.getByText(`Cv - ${resume.title}`)).toBeVisible();
  });
});

test.describe('create resume dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resumes');
    await page.getByRole('button', { name: 'Nouveau CV' }).click();
  });

  test('opens on "Nouveau CV" and closes on "Annuler"', async ({ page }) => {
    await expect(page.getByPlaceholder('Titre du CV...')).toBeVisible();

    await page.getByRole('button', { name: 'Annuler' }).click();

    await expect(page.getByPlaceholder('Titre du CV...')).toBeHidden();
  });

  test('enables "Créer" once a title is typed', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Créer' })).toBeDisabled();

    await page.getByPlaceholder('Titre du CV...').fill('Mon nouveau CV');

    await expect(page.getByRole('button', { name: 'Créer' })).toBeEnabled();
  });

  test('creates a resume that shows in the list', async ({ page }) => {
    const title = uniqueTitle('CV créé');

    await page.getByPlaceholder('Titre du CV...').fill(title);
    await page.getByRole('button', { name: 'Créer' }).click();

    await expect(page.getByPlaceholder('Titre du CV...')).toBeHidden();
    await expect(page.getByText(title)).toBeVisible();
  });
});
