import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@portfolio/core';
import { CreateProjectRequestDto, ProjectDto, UpdateProjectRequestDto } from '@portfolio/shared-models/server';

import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class ProjectService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _projectMapper: ProjectMapper,
  ) {}

  async findAll(): Promise<ProjectDto[]> {
    const projects = await this._prismaService.project.findMany({
      include: {
        tags: true,
      },
    });

    return this._projectMapper.toProjectDtoList(projects);
  }

  async findOne(id: string): Promise<ProjectDto> {
    const project = await this._prismaService.project.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return this._projectMapper.toProjectDto(project);
  }

  async create(dto: CreateProjectRequestDto): Promise<ProjectDto> {
    const project = await this._prismaService.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        url: dto.url,
        repoUrl: dto.repoUrl,
        imageUrl: dto.imageUrl,
        tags: {
          connectOrCreate: dto.tags.map(tag => ({
            where: { title: tag },
            create: { title: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    return this._projectMapper.toProjectDto(project);
  }

  async update(id: string, dto: UpdateProjectRequestDto): Promise<ProjectDto> {
    await this.findOne(id);

    const tagsUpdate = dto.tags
      ? {
          set: [],
          connectOrCreate: dto.tags.map(tag => ({
            where: { title: tag },
            create: { title: tag },
          })),
        }
      : undefined;

    const project = await this._prismaService.project.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        url: dto.url,
        repoUrl: dto.repoUrl,
        imageUrl: dto.imageUrl,
        tags: tagsUpdate,
      },
      include: {
        tags: true,
      },
    });

    await this._cleanOrphanTags();

    return this._projectMapper.toProjectDto(project);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this._prismaService.project.delete({ where: { id } });
    await this._cleanOrphanTags();
  }

  private async _cleanOrphanTags(): Promise<void> {
    await this._prismaService.tag.deleteMany({
      where: { projects: { none: {} } },
    });
  }
}
