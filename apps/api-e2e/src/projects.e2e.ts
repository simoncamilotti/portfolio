import { uniqueUser } from '@repo/e2e-support';
import { describe, expect, it } from 'vitest';
import { request, uniqueTitle } from './context.js';

interface Project {
  id: string;
  title: string;
  tags: string[];
}

const user = uniqueUser();

async function createProject(): Promise<Project> {
  const response = await request('POST', '/api/projects', {
    user,
    body: {
      title: uniqueTitle('Projet'),
      description: 'Projet de test',
      tags: ['e2e'],
      repoUrl: 'https://github.com/example/e2e',
    },
  });
  expect(response.status).toBe(201);
  return (await response.json()) as Project;
}

describe('projects', () => {
  it('requires a token to write', async () => {
    const response = await request('POST', '/api/projects', {
      body: { title: uniqueTitle('Projet'), tags: [] },
    });

    expect(response.status).toBe(401);
  });

  it('lists the created project publicly', async () => {
    const project = await createProject();

    const response = await request('GET', '/api/projects');

    expect(response.status).toBe(200);
    expect(await response.json()).toContainEqual(
      expect.objectContaining({ id: project.id, title: project.title, tags: ['e2e'] }),
    );
  });

  it('updates a project', async () => {
    const project = await createProject();
    const title = uniqueTitle('Projet modifié');

    const response = await request('PATCH', `/api/projects/${project.id}`, {
      user,
      body: { title },
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: project.id, title });
  });

  it('deletes a project', async () => {
    const project = await createProject();

    const deleted = await request('DELETE', `/api/projects/${project.id}`, { user });
    const found = await request('GET', `/api/projects/${project.id}`, { user });

    expect(deleted.status).toBe(204);
    expect(found.status).toBe(404);
  });
});
