import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator.js';
import {
  CreateFeatureFlagRequestDto,
  FeatureFlagDto,
  UpdateFeatureFlagRequestDto,
} from '@repo/contracts/server';

import { FeatureFlagService } from './feature-flag.service.js';

@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private readonly _featureFlagService: FeatureFlagService) {}

  @Public()
  @Get()
  async findAll(): Promise<FeatureFlagDto[]> {
    return this._featureFlagService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFeatureFlagRequestDto): Promise<FeatureFlagDto> {
    return this._featureFlagService.create(dto);
  }

  @Patch(':key')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('key') key: string,
    @Body() dto: UpdateFeatureFlagRequestDto,
  ): Promise<FeatureFlagDto> {
    return this._featureFlagService.update(key, dto);
  }
}
