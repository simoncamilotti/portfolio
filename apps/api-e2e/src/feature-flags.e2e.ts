import { uniqueUser } from '@repo/e2e-support';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { request } from './context.js';

const user = uniqueUser();

describe('feature flags', () => {
  it('requires a token to write', async () => {
    const response = await request('POST', '/api/feature-flags', {
      body: { key: `e2e-${randomUUID()}`, enabled: true },
    });

    expect(response.status).toBe(401);
  });

  it('creates and toggles a flag, listed publicly', async () => {
    const key = `e2e-${randomUUID()}`;

    const created = await request('POST', '/api/feature-flags', {
      user,
      body: { key, enabled: true },
    });
    const toggled = await request('PATCH', `/api/feature-flags/${key}`, {
      user,
      body: { enabled: false },
    });
    const list = await request('GET', '/api/feature-flags');

    expect(created.status).toBe(201);
    expect(toggled.status).toBe(200);
    expect(await list.json()).toContainEqual({ key, enabled: false });
  });
});
