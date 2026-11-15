import type { ProjectDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { projectsKey } from '../projects.key.js';
import { ProjectsService } from '../projects.service.js';

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: Parameters<typeof ProjectsService.updateProject>[1];
    }) => ProjectsService.updateProject(projectId, data),
    onSuccess: (updatedProject: ProjectDto) => {
      queryClient.setQueryData<ProjectDto[]>(
        projectsKey.getAllProjects,
        (projects) => projects?.map((p) => (p.id === updatedProject.id ? updatedProject : p)) ?? [],
      );
    },
  });

  return { updateProjectMutation };
};
