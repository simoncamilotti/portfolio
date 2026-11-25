import { uniqueUser } from '@repo/e2e-support';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { request, uniqueTitle } from './context.js';

interface Resume {
  id: string;
  title: string;
  content: unknown;
  isPublic: boolean;
}

const user = uniqueUser();

async function createResume(overrides: Record<string, unknown> = {}): Promise<Resume> {
  const response = await request('POST', '/api/resumes', {
    user,
    body: { title: uniqueTitle('CV'), content: 'Contenu du CV', ...overrides },
  });
  expect(response.status).toBe(201);
  return (await response.json()) as Resume;
}

describe('resumes', () => {
  let resume: Resume;

  beforeEach(async () => {
    resume = await createResume();
  });

  it('requires a token on the protected routes', async () => {
    const routes: [string, string][] = [
      ['POST', '/api/resumes'],
      ['GET', '/api/resumes'],
      ['GET', `/api/resumes/${resume.id}`],
      ['PATCH', `/api/resumes/${resume.id}`],
      ['PATCH', `/api/resumes/${resume.id}/public`],
      ['DELETE', `/api/resumes/${resume.id}`],
    ];
    for (const [method, path] of routes) {
      const body = method === 'GET' || method === 'DELETE' ? undefined : {};
      expect((await request(method, path, { body })).status, `${method} ${path}`).toBe(401);
    }
  });

  it('creates a resume', async () => {
    const title = uniqueTitle('CV');

    const response = await request('POST', '/api/resumes', {
      user,
      body: { title, content: 'Contenu', description: 'Description' },
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ title, description: 'Description' });
  });

  it('rejects an invalid resume', async () => {
    const response = await request('POST', '/api/resumes', { user, body: { title: 'ab' } });

    expect(response.status).toBe(400);
  });

  it('lists the created resume', async () => {
    const response = await request('GET', '/api/resumes', { user });

    expect(response.status).toBe(200);
    expect(await response.json()).toContainEqual(
      expect.objectContaining({ id: resume.id, title: resume.title }),
    );
  });

  it('reads a resume, and answers 404 for an unknown one', async () => {
    const found = await request('GET', `/api/resumes/${resume.id}`, { user });
    const missing = await request('GET', `/api/resumes/${randomUUID()}`, { user });

    expect(found.status).toBe(200);
    expect(await found.json()).toMatchObject({ id: resume.id, title: resume.title });
    expect(missing.status).toBe(404);
  });

  it('updates a resume', async () => {
    const title = uniqueTitle('CV modifié');

    const response = await request('PATCH', `/api/resumes/${resume.id}`, {
      user,
      body: { title, content: 'Nouveau contenu' },
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ title });
  });

  it('serves the public resume without a token', async () => {
    const published = await request('PATCH', `/api/resumes/${resume.id}/public`, {
      user,
      body: { isPublic: true },
    });

    const response = await request('GET', '/api/resumes/public');

    expect(published.status).toBe(200);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: resume.id, isPublic: true });
  });

  it('deletes a resume, then answers 404', async () => {
    const deleted = await request('DELETE', `/api/resumes/${resume.id}`, { user });
    const again = await request('DELETE', `/api/resumes/${resume.id}`, { user });

    expect(deleted.status).toBe(204);
    expect(again.status).toBe(404);
  });
});
