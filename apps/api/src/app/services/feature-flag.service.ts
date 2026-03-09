import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@portfolio/core';
import type { FeatureFlagDto, UpdateFeatureFlagRequestDto } from '@portfolio/shared-models/server';

import { FeatureFlagMapper } from '../mappers/feature-flag.mapper';

@Injectable()
export class FeatureFlagService {
  private readonly _logger = new Logger(FeatureFlagService.name);

  constructor(
    private readonly _prisma: PrismaService,
    private readonly _featureFlagMapper: FeatureFlagMapper,
  ) {}

  async findAll(): Promise<FeatureFlagDto[]> {
    const flags = await this._prisma.featureFlag.findMany();
    return this._featureFlagMapper.toFeatureFlagDtoList(flags);
  }

  async update(key: string, dto: UpdateFeatureFlagRequestDto): Promise<FeatureFlagDto> {
    const existing = await this._prisma.featureFlag.findUnique({ where: { key } });

    if (!existing) {
      throw new NotFoundException(`Feature flag '${key}' not found`);
    }

    const flag = await this._prisma.featureFlag.update({
      where: { key },
      data: { enabled: dto.enabled },
    });

    return this._featureFlagMapper.toFeatureFlagDto(flag);
  }
}
