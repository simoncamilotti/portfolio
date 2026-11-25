import { type ChildProcess, execFileSync, spawn } from 'node:child_process';
import { join } from 'node:path';

export interface StartApiOptions {
  /** Root of the repository: the API is started from `apps/api/dist`. */
  workspaceRoot: string;
  port: number;
  databaseUrl: string;
  issuerUrl: string;
  audience: string;
  smtpUrl: string;
  /** Origins allowed by CORS: client and studio (docs/adr/0002-two-web-applications.md). */
  webUrls: string[];
  /** Stands in for Google's reCAPTCHA verification (docs/adr/0003-contact-form.md). */
  recaptchaVerifyUrl: string;
  timeoutMs: number;
}

/** Recipient of the contact form messages in e2e: the tests find them in Mailpit. */
export const E2E_CONTACT_EMAIL = 'contact@example.test';

export interface RunningApi {
  url: string;
  stop: () => Promise<void>;
}

/** Applies the migrations to the e2e database, as the Kubernetes Job does in production. */
export function migrateDatabase(workspaceRoot: string, databaseUrl: string): void {
  execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
    cwd: join(workspaceRoot, 'apps/api'),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });
}

/** Starts the production build of the API and waits until it is ready. */
export async function startApi(options: StartApiOptions): Promise<RunningApi> {
  const url = `http://localhost:${options.port}`;
  const smtp = new URL(options.smtpUrl);
  const output: string[] = [];
  const child: ChildProcess = spawn(
    'node',
    ['--import', './dist/instrumentation.js', 'dist/main.js'],
    {
      cwd: join(options.workspaceRoot, 'apps/api'),
      env: {
        ...process.env,
        NODE_ENV: 'test',
        TZ: 'Etc/UTC',
        PORT: String(options.port),
        LOG_LEVEL: 'warn',
        DATABASE_URL: options.databaseUrl,
        OIDC_ISSUER_URL: options.issuerUrl,
        OIDC_AUDIENCE: options.audience,
        // Contact form (docs/adr/0003-contact-form.md): SMTP host and port of Mailpit.
        SMTP_HOST: smtp.hostname,
        SMTP_PORT: smtp.port || '25',
        SMTP_USER: '',
        SMTP_PASS: '',
        SMTP_FROM: 'E2E <e2e@example.test>',
        CONTACT_EMAIL_TO: E2E_CONTACT_EMAIL,
        RECAPTCHA_SECRET_KEY: 'e2e',
        RECAPTCHA_VERIFY_URL: options.recaptchaVerifyUrl,
        CORS_ORIGINS: options.webUrls.join(','),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  child.stdout?.on('data', (chunk: Buffer) => output.push(chunk.toString()));
  child.stderr?.on('data', (chunk: Buffer) => output.push(chunk.toString()));

  const stop = () =>
    new Promise<void>((resolve) => {
      if (child.exitCode !== null) {
        resolve();
        return;
      }
      child.once('exit', () => resolve());
      child.kill('SIGTERM');
    });

  try {
    await waitUntilReady(`${url}/api/health/ready`, options.timeoutMs, () => child.exitCode);
  } catch (error) {
    await stop();
    throw new Error(`${(error as Error).message}\n--- API output ---\n${output.join('')}`);
  }
  return { url, stop };
}

async function waitUntilReady(
  healthUrl: string,
  timeoutMs: number,
  exitCode: () => number | null,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError = 'no response';
  while (Date.now() < deadline) {
    if (exitCode() !== null) {
      throw new Error(`The API exited with code ${exitCode()} before being ready.`);
    }
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        return;
      }
      lastError = `HTTP ${response.status}: ${await response.text()}`;
    } catch (error) {
      lastError = String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(
    `The API was not ready after ${timeoutMs} ms (${healthUrl}). Last error: ${lastError}. ` +
      'Increase E2E_API_TIMEOUT_MS if the machine is slow.',
  );
}
