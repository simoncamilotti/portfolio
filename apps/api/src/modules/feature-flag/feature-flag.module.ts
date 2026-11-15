import { Module } from '@nestjs/common';

import { FeatureFlagController } from './feature-flag.controller.js';
import { FeatureFlagMapper } from './feature-flag.mapper.js';
import { FeatureFlagService } from './feature-flag.service.js';

@Module({
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService, FeatureFlagMapper],
})
export class FeatureFlagModule {}
