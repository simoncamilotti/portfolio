import { Injectable } from '@nestjs/common';
import type { ResumeDetailDto, ResumeDto } from '@portfolio/shared-models/server';
import { Resume } from '@prisma/client';

@Injectable()
export class ResumeMapper {
  toResumeDto(resume: Resume): ResumeDto {
    return {
      id: resume.id,
      title: resume.title,
      description: resume.description ?? undefined,
      isPublic: resume.isPublic,
      shareEnabled: resume.shareEnabled,
      updatedAt: resume.updatedAt.toISOString(),
      views: resume.views,
      downloads: resume.downloads,
    };
  }

  toResumeDtoList(resumes: Resume[]): ResumeDto[] {
    return resumes.map(resume => this.toResumeDto(resume));
  }

  toResumeDetailDto(resume: Resume): ResumeDetailDto {
    return {
      ...this.toResumeDto(resume),
      content: resume.content,
    };
  }
}
