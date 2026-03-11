import type { ProjectDto } from '@portfolio/shared-models';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { projectsKey } from '../projects.key';
import { ProjectsService } from '../projects.service';

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: ProjectsService.createProject,
    onSuccess: (createdProject: ProjectDto) => {
      queryClient.setQueryData<ProjectDto[]>(projectsKey.getAllProjects, projects => [
        createdProject,
        ...(projects ?? []),
      ]);
    },
  });

  return { createProjectMutation };
};
