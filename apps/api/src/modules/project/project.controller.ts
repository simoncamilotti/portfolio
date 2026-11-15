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
  type CreateProjectRequestDto,
  createProjectRequestDtoSchema,
  type ProjectDto,
  projectDtoSchema,
  type UpdateProjectRequestDto,
  updateProjectRequestDtoSchema,
} from '@repo/contracts';

import { Public } from '../../common/auth/public.decorator.js';
import {
  ResponseListSchema,
  ResponseSchema,
} from '../../common/serialization/response-schema.decorator.js';
import { ProjectService } from './project.service.js';

@Controller('projects')
export class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}

  @Public()
  @Get()
  @ResponseListSchema(projectDtoSchema)
  async findAll(): Promise<ProjectDto[]> {
    return this._projectService.findAll();
  }

  @Get(':id')
  @ResponseSchema(projectDtoSchema)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectDto> {
    return this._projectService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseSchema(projectDtoSchema)
  async create(
    @Body({ schema: createProjectRequestDtoSchema }) dto: CreateProjectRequestDto,
  ): Promise<ProjectDto> {
    return this._projectService.create(dto);
  }

  @Patch(':id')
  @ResponseSchema(projectDtoSchema)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body({ schema: updateProjectRequestDtoSchema }) dto: UpdateProjectRequestDto,
  ): Promise<ProjectDto> {
    return this._projectService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this._projectService.remove(id);
  }
}
