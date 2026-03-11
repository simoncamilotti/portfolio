import type { ProjectDto } from '@portfolio/shared-models';

import { axiosInstance } from '../api/axiosInstance';

export const ProjectsService = {
  getAllProjects: (): Promise<ProjectDto[]> => axiosInstance.get<ProjectDto[]>('projects').then(({ data }) => data),
};
