import { join } from 'node:path';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule, type MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js';

import type { Env } from '../../config/env.js';
import { ContactController } from './contact.controller.js';
import { ContactService } from './contact.service.js';

const IMPLICIT_TLS_PORT = 465;

function mailerOptions(config: ConfigService<Env, true>): MailerOptions {
  const port = config.get('SMTP_PORT', { infer: true });
  const user = config.get('SMTP_USER', { infer: true });
  return {
    transport: {
      host: config.get('SMTP_HOST', { infer: true }),
      port,
      secure: port === IMPLICIT_TLS_PORT,
      // Local Mailpit accepts unauthenticated mail.
      ...(user ? { auth: { user, pass: config.get('SMTP_PASS', { infer: true }) } } : {}),
    },
    defaults: {
      from: config.get('SMTP_FROM', { infer: true }),
    },
    template: {
      // Copied next to the build output by nest-cli.json (assets).
      dir: join(import.meta.dirname, 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}

@Module({
  imports: [
    HttpModule,
    MailerModule.forRootAsync({ imports: [], inject: [ConfigService], useFactory: mailerOptions }),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
