import type { ProjectDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { projectsKey } from '../projects.key.js';
import { ProjectsService } from '../projects.service.js';

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: ProjectsService.createProject,
    onSuccess: (createdProject: ProjectDto) => {
      queryClient.setQueryData<ProjectDto[]>(projectsKey.getAllProjects, (projects) => [
        createdProject,
        ...(projects ?? []),
      ]);
    },
  });

  return { createProjectMutation };
};
