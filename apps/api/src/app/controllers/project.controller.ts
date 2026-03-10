import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateProjectRequestDto, ProjectDto, UpdateProjectRequestDto } from '@portfolio/shared-models/server';

import { ProjectService } from '../services/project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}

  @Get()
  async findAll(): Promise<ProjectDto[]> {
    return this._projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectDto> {
    return this._projectService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProjectRequestDto): Promise<ProjectDto> {
    return this._projectService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProjectRequestDto): Promise<ProjectDto> {
    return this._projectService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this._projectService.remove(id);
  }
}
