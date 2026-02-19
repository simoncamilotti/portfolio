import type { GetAllResumesResponseDto, ResumeDto } from '@portfolio/shared-models';

import { axiosInstance } from '../api/axiosInstance';

export const ResumesService = {
  getAllResumes: (): Promise<ResumeDto[]> =>
    axiosInstance.get<GetAllResumesResponseDto>('resumes').then(({ data }) => data),
  deleteResumeById: (id: string): Promise<void> => axiosInstance.delete(`resumes/${id}`),
};
