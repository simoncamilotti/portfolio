import { Injectable } from '@nestjs/common';
import { GetAllResumesResponseDto } from '@portfolio/shared-models';
import { Resume } from '@prisma/client';

@Injectable()
export class ResumeMapper {
  toGetAllResumesResponseDto(resumes: Resume[]): GetAllResumesResponseDto {
    return resumes.map(resume => ({
      id: resume.id,
      title: resume.title,
      description: resume.description,
      isPublic: resume.isPublic,
      shareEnabled: resume.shareEnabled,
      updatedAt: resume.updatedAt.toISOString(),
      views: resume.views,
      downloads: resume.downloads,
    }));
  }
}
