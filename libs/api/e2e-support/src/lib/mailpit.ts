interface MailpitMessage {
  ID: string;
  Subject: string;
  To: { Address: string }[];
}

/** Waits for an e-mail sent to this address, through the Mailpit API (ADR 0009). */
export async function waitForEmail(
  mailpitUrl: string,
  to: string,
  timeoutMs = 10_000,
): Promise<MailpitMessage> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const response = await fetch(
      `${mailpitUrl}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`,
    );
    if (response.ok) {
      const { messages } = (await response.json()) as { messages: MailpitMessage[] };
      if (messages[0]) {
        return messages[0];
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`No e-mail to ${to} after ${timeoutMs} ms (Mailpit: ${mailpitUrl}).`);
}
