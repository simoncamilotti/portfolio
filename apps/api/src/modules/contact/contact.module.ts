import { join } from 'node:path';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MailerModule, type MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js';

import { ContactController } from './contact.controller.js';
import { ContactService } from './contact.service.js';

const mailerOptions: MailerOptions = {
  transport: {
    host: process.env['SMTP_HOST'],
    port: 465,
    secure: true,
    auth: {
      user: process.env['SMTP_USER'],
      pass: process.env['SMTP_PASS'],
    },
  },
  defaults: {
    from: process.env['SMTP_FROM'],
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

@Module({
  imports: [HttpModule, MailerModule.forRoot(mailerOptions)],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
