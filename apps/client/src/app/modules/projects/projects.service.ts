import type { ProjectDto } from '@repo/contracts';

import { axiosInstance } from '../api/axiosInstance.js';

export const ProjectsService = {
  getAllProjects: (): Promise<ProjectDto[]> =>
    axiosInstance.get<ProjectDto[]>('projects').then(({ data }) => data),
};
