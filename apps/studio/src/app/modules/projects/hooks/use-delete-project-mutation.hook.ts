import type { ProjectDto } from '@portfolio/shared-models';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { projectsKey } from '../projects.key';
import { ProjectsService } from '../projects.service';

export const useDeleteProjectMutation = (projectIdToDelete: string) => {
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: () => ProjectsService.deleteProject(projectIdToDelete),
    onMutate: () => {
      queryClient.setQueryData<ProjectDto[]>(projectsKey.getAllProjects, data =>
        data?.filter(({ id }) => id !== projectIdToDelete),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsKey.getAllProjects }),
    onError: async error => {
      queryClient.invalidateQueries({ queryKey: projectsKey.getAllProjects });
      throw error;
    },
  });

  return { deleteProjectMutation };
};
