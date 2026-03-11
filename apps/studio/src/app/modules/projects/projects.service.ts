import type { CreateProjectRequestDto, ProjectDto, UpdateProjectRequestDto } from '@portfolio/shared-models';

import { axiosInstance } from '../api/axiosInstance';

export const ProjectsService = {
  getAllProjects: (): Promise<ProjectDto[]> => axiosInstance.get<ProjectDto[]>('projects').then(({ data }) => data),
  getProjectById: (projectId: string): Promise<ProjectDto> =>
    axiosInstance.get<ProjectDto>(`projects/${projectId}`).then(({ data }) => data),
  createProject: (project: CreateProjectRequestDto): Promise<ProjectDto> =>
    axiosInstance.post<ProjectDto>('projects', project).then(({ data }) => data),
  updateProject: (projectId: string, project: UpdateProjectRequestDto): Promise<ProjectDto> =>
    axiosInstance.patch<ProjectDto>(`projects/${projectId}`, project).then(({ data }) => data),
  deleteProject: (projectId: string): Promise<void> => axiosInstance.delete(`projects/${projectId}`),
};
