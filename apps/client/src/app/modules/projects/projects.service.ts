import type { ProjectDto } from '@repo/contracts';

import { axiosInstance } from '../api/axios-instance.js';

export const ProjectsService = {
  getAllProjects: (): Promise<ProjectDto[]> =>
    axiosInstance.get<ProjectDto[]>('projects').then(({ data }) => data),
};
