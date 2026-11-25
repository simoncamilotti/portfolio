import { randomUUID } from 'node:crypto';
import { issuerFromEnv, signAccessToken, type TestUser } from '@repo/e2e-support';
import { inject } from 'vitest';

export const apiUrl = inject('apiUrl');

const issuer = issuerFromEnv({
  E2E_OIDC_ISSUER_URL: inject('issuerUrl'),
  E2E_OIDC_PRIVATE_JWK: inject('issuerPrivateJwk'),
});

/** Authorization header of a signed-in user. */
export async function authHeader(user: TestUser): Promise<Record<string, string>> {
  return { Authorization: `Bearer ${await signAccessToken(issuer, user)}` };
}

/** A title nobody else uses (the database is never cleaned), within the 50 characters allowed. */
export function uniqueTitle(prefix: string): string {
  return `${prefix} ${randomUUID().slice(0, 8)}`;
}

/** JSON request to the API, signed in as `user` when given. */
export async function request(
  method: string,
  path: string,
  options: { user?: TestUser; body?: unknown } = {},
): Promise<Response> {
  return fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(options.user ? await authHeader(options.user) : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}
