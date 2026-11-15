import { Injectable } from '@nestjs/common';
import { ProjectWithTags } from './project.type.js';
import { ProjectDto } from '@repo/contracts/server';

@Injectable()
export class ProjectMapper {
  toProjectDto(project: ProjectWithTags): ProjectDto {
    return {
      id: project.id,
      title: project.title,
      description: project.description ?? undefined,
      tags: project.tags.map((tag) => tag.title),
      url: project.url ?? undefined,
      repoUrl: project.repoUrl ?? undefined,
      imageUrl: project.imageUrl ?? undefined,
    };
  }

  toProjectDtoList(projects: ProjectWithTags[]): ProjectDto[] {
    return projects.map((project) => this.toProjectDto(project));
  }
}
