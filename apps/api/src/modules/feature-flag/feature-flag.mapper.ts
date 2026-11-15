import { Injectable } from '@nestjs/common';
import type { FeatureFlagDto } from '@repo/contracts';
import { FeatureFlag } from '../../generated/prisma/client.js';

@Injectable()
export class FeatureFlagMapper {
  toFeatureFlagDto(flag: FeatureFlag): FeatureFlagDto {
    return {
      key: flag.key,
      enabled: flag.enabled,
    };
  }

  toFeatureFlagDtoList(flags: FeatureFlag[]): FeatureFlagDto[] {
    return flags.map((flag) => this.toFeatureFlagDto(flag));
  }
}
