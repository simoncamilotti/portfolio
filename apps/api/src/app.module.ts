import { Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule, type Params } from 'nestjs-pino';
import type { Options } from 'pino-http';

import { AuthModule } from './common/auth/auth.module.js';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard.js';
import { DatabaseModule } from './common/database/database.module.js';
import { ContactModule } from './modules/contact/contact.module.js';
import { FeatureFlagModule } from './modules/feature-flag/feature-flag.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { ProjectModule } from './modules/project/project.module.js';
import { ResumeModule } from './modules/resume/resume.module.js';

const pinoOptions: Params = {
  forRoutes: [{ method: RequestMethod.ALL, path: '*splat' }],
  pinoHttp: {
    level: process.env['NODE_ENV'] !== 'production' ? 'debug' : 'info',
    redact: ['req.headers.authorization', 'req.headers.cookie'],
    autoLogging: {
      ignore: (req): boolean => ['/health'].some((publicPath) => req.url === publicPath),
    },
    transport: process.env['NODE_ENV'] !== 'production' ? { target: 'pino-pretty' } : undefined,
  } as Options,
};

@Module({
  imports: [
    LoggerModule.forRoot(pinoOptions),
    DatabaseModule,
    AuthModule,
    HealthModule,
    ContactModule,
    FeatureFlagModule,
    ProjectModule,
    ResumeModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
