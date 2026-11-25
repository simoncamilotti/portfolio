import { uniqueUser } from '@repo/e2e-support';
import { describe, expect, it } from 'vitest';
import { apiUrl, request } from './context.js';

describe('authentication', () => {
  it('rejects a protected route without a token', async () => {
    expect((await request('GET', '/api/resumes')).status).toBe(401);
  });

  it('rejects a token that is not signed by the issuer', async () => {
    const response = await fetch(`${apiUrl}/api/resumes`, {
      headers: { Authorization: 'Bearer invalid-token' },
    });

    expect(response.status).toBe(401);
  });

  it('accepts a token signed by the issuer', async () => {
    expect((await request('GET', '/api/resumes', { user: uniqueUser() })).status).toBe(200);
  });

  it('serves the public routes without a token', async () => {
    expect((await request('GET', '/api/health/live')).status).toBe(200);
  });
});
