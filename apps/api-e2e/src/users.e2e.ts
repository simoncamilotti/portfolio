import { uniqueUser } from '@repo/e2e-support';
import { describe, expect, it } from 'vitest';
import { request } from './context.js';

describe('GET /api/users/me', () => {
  it('requires a token', async () => {
    expect((await request('GET', '/api/users/me')).status).toBe(401);
  });

  it('creates the account at the first request', async () => {
    const user = uniqueUser({ locale: 'en' });

    const response = await request('GET', '/api/users/me', { user });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      id: expect.any(String),
      email: user.email,
      name: user.name,
      locale: 'en',
    });
  });

  it('returns the same account afterwards', async () => {
    const user = uniqueUser();

    const first = (await (await request('GET', '/api/users/me', { user })).json()) as {
      id: string;
    };
    const second = (await (await request('GET', '/api/users/me', { user })).json()) as {
      id: string;
    };

    expect(second.id).toBe(first.id);
  });
});
