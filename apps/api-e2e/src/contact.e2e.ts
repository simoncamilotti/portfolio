import { E2E_CONTACT_EMAIL, readE2eEnv } from '@repo/e2e-support';
import { describe, expect, it } from 'vitest';
import { request, uniqueTitle } from './context.js';

const message = {
  name: 'Jane Doe',
  email: 'jane@example.test',
  subject: 'Sujet',
  message: 'Un message assez long pour passer la validation.',
  captchaToken: 'e2e-token',
};

interface MailpitMessage {
  Subject: string;
}

/** Messages to the contact address, by subject: the recipient is shared by every run. */
async function waitForSubject(subject: string, timeoutMs = 10_000): Promise<MailpitMessage> {
  const mailpitUrl = readE2eEnv().E2E_MAILPIT_URL;
  const query = encodeURIComponent(`to:"${E2E_CONTACT_EMAIL}" subject:"${subject}"`);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const response = await fetch(`${mailpitUrl}/api/v1/search?query=${query}`);
    if (response.ok) {
      const { messages } = (await response.json()) as { messages: MailpitMessage[] };
      if (messages[0]) {
        return messages[0];
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`No e-mail "${subject}" to ${E2E_CONTACT_EMAIL} after ${timeoutMs} ms.`);
}

describe('POST /api/contact', () => {
  it('sends the message to the contact address, without a token', async () => {
    const subject = uniqueTitle('Contact');

    const response = await request('POST', '/api/contact', { body: { ...message, subject } });

    expect(response.status).toBeLessThan(300);
    expect((await waitForSubject(subject)).Subject).toBe(`[Portfolio] ${subject}`);
  });

  it('rejects a message whose captcha fails', async () => {
    const response = await request('POST', '/api/contact', {
      body: { ...message, captchaToken: 'invalid' },
    });

    expect(response.status).toBe(400);
  });

  it.each([
    ['an empty body', {}],
    ['a missing name', { ...message, name: undefined }],
    ['an invalid e-mail', { ...message, email: 'not-an-email' }],
    ['a missing subject', { ...message, subject: undefined }],
    ['a message too short', { ...message, message: 'short' }],
    ['a missing captcha token', { ...message, captchaToken: undefined }],
    ['a name too long', { ...message, name: 'a'.repeat(101) }],
  ])('rejects %s', async (_case, body) => {
    expect((await request('POST', '/api/contact', { body })).status).toBe(400);
  });
});
