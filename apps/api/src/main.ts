import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from './app/app.module';

const DEFAULT_TIMEZONE = 'Etc/UTC';
const globalPrefix = 'api';

async function createApp(): Promise<INestApplication> {
  if (process.env.TZ !== DEFAULT_TIMEZONE) {
    throw new Error(`Invalid timezone. Should be defined to ${DEFAULT_TIMEZONE}, got: ${process.env.TZ}`);
  }

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  await setupApp(app);

  return app;
}

export const setupApp = async (app: INestApplication): Promise<void> => {
  app.setGlobalPrefix(globalPrefix, { exclude: ['health'] });

  setupLogger(app);
};

async function main(): Promise<void> {
  const app = await createApp();
  // when running jest integration tests we can get the error "listen EADDRINUSE: address already in use :::XXXX" even when running in band.
  // this looks to be happening when jest switch to the next test suite. A small hack here is to assign the port to 0 in these cases,
  // where 0 means "assign me a random port that is available"
  const port = process.env.NODE_ENV === 'test' ? 0 : (process.env.PORT ?? 3000);
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

const setupLogger = (app: INestApplication): void => {
  if (process.env.NODE_ENV === 'test') {
    app.useLogger(false);
    return;
  }

  app.useLogger(app.get(PinoLogger));
};

main();
