import { Global, Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [HealthModule, PrismaModule],
  exports: [PrismaModule],
})
export class CoreModule {}
