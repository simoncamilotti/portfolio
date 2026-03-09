import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { Public } from '@portfolio/core';
import { FeatureFlagDto, UpdateFeatureFlagRequestDto } from '@portfolio/shared-models/server';

import { FeatureFlagService } from '../services/feature-flag.service';

@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private readonly _featureFlagService: FeatureFlagService) {}

  @Public()
  @Get()
  async findAll(): Promise<FeatureFlagDto[]> {
    return this._featureFlagService.findAll();
  }

  @Patch(':key')
  @HttpCode(HttpStatus.OK)
  async update(@Param('key') key: string, @Body() dto: UpdateFeatureFlagRequestDto): Promise<FeatureFlagDto> {
    return this._featureFlagService.update(key, dto);
  }
}
