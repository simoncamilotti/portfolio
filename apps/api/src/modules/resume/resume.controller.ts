import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';
import {
  type CreateResumeRequestDto,
  createResumeRequestDtoSchema,
  type ResumeDetailDto,
  resumeDetailDtoSchema,
  type ResumeDto,
  resumeDtoSchema,
  type SetPublicResumeRequestDto,
  setPublicResumeRequestDtoSchema,
  type UpdateResumeRequestDto,
  updateResumeRequestDtoSchema,
} from '@repo/contracts';

import { Public } from '../../common/auth/public.decorator.js';
import {
  ResponseListSchema,
  ResponseSchema,
} from '../../common/serialization/response-schema.decorator.js';
import { ResumeService } from './resume.service.js';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly _resumeService: ResumeService) {}

  @Get()
  @ResponseListSchema(resumeDtoSchema)
  async findAll(): Promise<ResumeDto[]> {
    return this._resumeService.findAll();
  }

  @Public()
  @Get('public')
  @ResponseSchema(resumeDetailDtoSchema)
  async findPublic(): Promise<ResumeDetailDto> {
    return this._resumeService.findPublic();
  }

  @Get(':id')
  @ResponseSchema(resumeDetailDtoSchema)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResumeDetailDto> {
    return this._resumeService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseSchema(resumeDetailDtoSchema)
  async create(
    @Body({ schema: createResumeRequestDtoSchema }) dto: CreateResumeRequestDto,
  ): Promise<ResumeDetailDto> {
    return this._resumeService.create(dto);
  }

  @Patch(':id')
  @ResponseSchema(resumeDetailDtoSchema)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body({ schema: updateResumeRequestDtoSchema }) dto: UpdateResumeRequestDto,
  ): Promise<ResumeDetailDto> {
    return this._resumeService.update(id, dto);
  }

  @Patch(':id/public')
  @ResponseSchema(resumeDetailDtoSchema)
  async setPublic(
    @Param('id', ParseUUIDPipe) id: string,
    @Body({ schema: setPublicResumeRequestDtoSchema }) dto: SetPublicResumeRequestDto,
  ): Promise<ResumeDetailDto> {
    return this._resumeService.setPublic(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this._resumeService.remove(id);
  }
}
