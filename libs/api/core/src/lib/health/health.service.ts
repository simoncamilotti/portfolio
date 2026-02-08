import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaHealthIndicator } from '@nestjs/terminus';

import { PrismaService } from '../prisma/services/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly _prismaHealth: PrismaHealthIndicator,
    private readonly _prismaService: PrismaService,
  ) {}

  async database(): Promise<HealthIndicatorResult> {
    return this._prismaHealth.pingCheck('database', this._prismaService);
  }
}
