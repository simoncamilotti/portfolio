import { Global, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { LoggerModule, Params } from 'nestjs-pino';
import { Options } from 'pino-http';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

const pinoOptions: Params = {
  forRoutes: [{ method: RequestMethod.ALL, path: '*splat' }],
  pinoHttp: {
    level: process.env['NODE_ENV'] !== 'production' ? 'debug' : 'info',
    redact: ['req.headers.authorization', 'req.headers.cookie'],
    autoLogging: {
      ignore: (req): boolean => ['/health'].some(publicPath => req.url === publicPath),
    },
    transport: process.env['NODE_ENV'] !== 'production' ? { target: 'pino-pretty' } : undefined,
  } as Options,
};

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
    dir: __dirname + '/assets/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};

@Global()
@Module({
  imports: [
    HealthModule,
    PrismaModule,
    AuthModule,
    LoggerModule.forRoot(pinoOptions),
    MailerModule.forRoot(mailerOptions),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
  exports: [PrismaModule, AuthModule, LoggerModule],
})
export class CoreModule {}
