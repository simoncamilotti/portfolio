import { Injectable } from '@nestjs/common';
import { ProjectWithTags } from '@portfolio/core';
import { ProjectDto } from '@portfolio/shared-models/server';

@Injectable()
export class ProjectMapper {
  toProjectDto(project: ProjectWithTags): ProjectDto {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      tags: project.tags.map(tag => tag.title),
      url: project.url,
      repoUrl: project.repoUrl,
      imageUrl: project.imageUrl,
    };
  }

  toProjectDtoList(projects: ProjectWithTags[]): ProjectDto[] {
    return projects.map(project => this.toProjectDto(project));
  }
}
