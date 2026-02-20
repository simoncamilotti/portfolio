import type {
  CreateResumeRequestDto,
  GetAllResumesResponseDto,
  GetResumeResponseDto,
  ResumeDto,
  SetPublicResumeRequestDto,
} from '@portfolio/shared-models';

import { axiosInstance } from '../api/axiosInstance';

export const ResumesService = {
  getAllResumes: (): Promise<ResumeDto[]> =>
    axiosInstance.get<GetAllResumesResponseDto>('resumes').then(({ data }) => data),
  deleteResumeById: (resumeId: string): Promise<void> => axiosInstance.delete(`resumes/${resumeId}`),
  createResume: (resume: CreateResumeRequestDto): Promise<ResumeDto> =>
    axiosInstance.post<GetResumeResponseDto>(`resumes`, resume).then(({ data }) => data),
  setResumeIsPublic: (resumeId: string, dto: SetPublicResumeRequestDto) =>
    axiosInstance.patch(`resumes/${resumeId}/public`, dto).then(({ data }) => data),
};
