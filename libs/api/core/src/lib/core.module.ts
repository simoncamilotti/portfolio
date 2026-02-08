import { Global, Module, RequestMethod } from '@nestjs/common';
import { LoggerModule, Params } from 'nestjs-pino';
import { Options } from 'pino-http';

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

@Global()
@Module({
  imports: [HealthModule, PrismaModule, LoggerModule.forRoot(pinoOptions)],
  exports: [PrismaModule, LoggerModule],
})
export class CoreModule {}
