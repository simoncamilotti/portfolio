import { issuerFromEnv, signAccessToken, uniqueUser } from '@repo/e2e-support';
import { randomUUID } from 'node:crypto';

/** Writes to the e2e API as a unique signed-in user: the tests create what they display. */
const admin = uniqueUser();

export async function apiRequest(method: string, path: string, body?: unknown): Promise<Response> {
  const token = await signAccessToken(issuerFromEnv(), admin);
  return fetch(`${process.env['E2E_API_URL']}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/** A title nobody else uses (the database is never cleaned), within the 50 characters allowed. */
export function uniqueTitle(prefix: string): string {
  return `${prefix} ${randomUUID().slice(0, 8)}`;
}

/**
 * Sets a feature flag, creating it if needed. Flags are global: the tests run one at a time
 * (workers: 1) and each sets the state it expects.
 */
export async function setFeatureFlag(key: string, enabled: boolean): Promise<void> {
  const updated = await apiRequest('PATCH', `/api/feature-flags/${key}`, { enabled });
  if (updated.ok) {
    return;
  }
  const created = await apiRequest('POST', '/api/feature-flags', { key, enabled });
  if (!created.ok) {
    throw new Error(`Feature flag ${key}: HTTP ${updated.status}, then ${created.status}.`);
  }
}

export async function createProject(title: string): Promise<void> {
  const response = await apiRequest('POST', '/api/projects', {
    title,
    description: 'Projet e2e',
    tags: ['e2e'],
    repoUrl: 'https://github.com/example/e2e',
  });
  if (response.status !== 201) {
    throw new Error(`Project creation: HTTP ${response.status}.`);
  }
}
