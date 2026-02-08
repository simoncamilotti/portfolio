import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';

import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(
    private readonly _healthCheckService: HealthCheckService,
    private readonly _healthService: HealthService,
  ) {}

  @Get('health')
  @HealthCheck()
  ready(): Promise<HealthCheckResult> {
    return this._healthCheckService.check([(): Promise<HealthIndicatorResult> => this._healthService.database()]);
  }
}
