import { issuerFromEnv, signAccessToken, uniqueUser } from '@repo/e2e-support';
import { randomUUID } from 'node:crypto';

/** Writes to the e2e API as a unique signed-in user: the tests create what they display. */
const admin = uniqueUser();

async function apiRequest(method: string, path: string, body?: unknown): Promise<Response> {
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

export async function createResume(
  title: string,
  options: { isPublic?: boolean } = {},
): Promise<{ id: string; title: string }> {
  const response = await apiRequest('POST', '/api/resumes', { title, content: 'Contenu e2e' });
  if (response.status !== 201) {
    throw new Error(`Resume creation: HTTP ${response.status}.`);
  }
  const resume = (await response.json()) as { id: string; title: string };
  if (options.isPublic) {
    const published = await apiRequest('PATCH', `/api/resumes/${resume.id}/public`, {
      isPublic: true,
    });
    if (!published.ok) {
      throw new Error(`Resume publication: HTTP ${published.status}.`);
    }
  }
  return resume;
}
