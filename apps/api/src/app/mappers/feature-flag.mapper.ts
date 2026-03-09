import { Injectable } from '@nestjs/common';
import type { FeatureFlagDto } from '@portfolio/shared-models/server';
import { FeatureFlag } from '@prisma/client';

@Injectable()
export class FeatureFlagMapper {
  toFeatureFlagDto(flag: FeatureFlag): FeatureFlagDto {
    return {
      key: flag.key,
      enabled: flag.enabled,
    };
  }

  toFeatureFlagDtoList(flags: FeatureFlag[]): FeatureFlagDto[] {
    return flags.map(flag => this.toFeatureFlagDto(flag));
  }
}
