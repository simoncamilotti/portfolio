import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Public } from '@portfolio/core';
import { CreateResumeRequestDto, GetAllResumesResponseDto, UpdateResumeRequestDto } from '@portfolio/shared-models';
import { Resume } from '@prisma/client';

import { ResumeService } from '../services/resume.service';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly _resumeService: ResumeService) {}

  @Get()
  async findAll(): Promise<GetAllResumesResponseDto> {
    return this._resumeService.findAll();
  }

  @Public()
  @Get('public')
  async findPublic(): Promise<Resume> {
    return this._resumeService.findPublic();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Resume> {
    return this._resumeService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateResumeRequestDto): Promise<Resume> {
    return this._resumeService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateResumeRequestDto): Promise<Resume> {
    return this._resumeService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this._resumeService.remove(id);
  }
}
