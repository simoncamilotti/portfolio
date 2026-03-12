import type {
  CreateResumeRequestDto,
  ResumeDetailDto,
  ResumeDto,
  SetPublicResumeRequestDto,
} from '@portfolio/shared-models';

import { axiosInstance } from '../api/axiosInstance';

export const ResumesService = {
  getAllResumes: (): Promise<ResumeDto[]> => axiosInstance.get<ResumeDto[]>('resumes').then(({ data }) => data),
  getResumeById: (resumeId: string): Promise<ResumeDetailDto> =>
    axiosInstance.get<ResumeDetailDto>(`resumes/${resumeId}`).then(({ data }) => data),
  deleteResumeById: (resumeId: string): Promise<void> => axiosInstance.delete(`resumes/${resumeId}`),
  createResume: (resume: CreateResumeRequestDto): Promise<ResumeDetailDto> =>
    axiosInstance.post<ResumeDetailDto>(`resumes`, resume).then(({ data }) => data),
  setResumeIsPublic: (resumeId: string, dto: SetPublicResumeRequestDto) =>
    axiosInstance.patch(`resumes/${resumeId}/public`, dto).then(({ data }) => data),
};
