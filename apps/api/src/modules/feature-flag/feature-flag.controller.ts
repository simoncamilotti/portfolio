import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
  type CreateFeatureFlagRequestDto,
  createFeatureFlagDtoRequestSchema,
  type FeatureFlagDto,
  featureFlagDtoSchema,
  type UpdateFeatureFlagRequestDto,
  updateFeatureFlagRequestDtoSchema,
} from '@repo/contracts';

import { Public } from '../../common/auth/public.decorator.js';
import {
  ResponseListSchema,
  ResponseSchema,
} from '../../common/serialization/response-schema.decorator.js';
import { FeatureFlagService } from './feature-flag.service.js';

@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private readonly _featureFlagService: FeatureFlagService) {}

  @Public()
  @Get()
  @ResponseListSchema(featureFlagDtoSchema)
  async findAll(): Promise<FeatureFlagDto[]> {
    return this._featureFlagService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseSchema(featureFlagDtoSchema)
  async create(
    @Body({ schema: createFeatureFlagDtoRequestSchema }) dto: CreateFeatureFlagRequestDto,
  ): Promise<FeatureFlagDto> {
    return this._featureFlagService.create(dto);
  }

  @Patch(':key')
  @HttpCode(HttpStatus.OK)
  @ResponseSchema(featureFlagDtoSchema)
  async update(
    @Param('key') key: string,
    @Body({ schema: updateFeatureFlagRequestDtoSchema }) dto: UpdateFeatureFlagRequestDto,
  ): Promise<FeatureFlagDto> {
    return this._featureFlagService.update(key, dto);
  }
}
