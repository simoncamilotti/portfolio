import { getProjectFindAllQueryKey, projectCreate } from '@repo/api-client';
import type { CreateProjectRequestDto, ProjectDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: (project: CreateProjectRequestDto) => projectCreate(project),
    onSuccess: (createdProject: ProjectDto) => {
      queryClient.setQueryData<ProjectDto[]>(getProjectFindAllQueryKey(), (projects) => [
        createdProject,
        ...(projects ?? []),
      ]);
    },
  });

  return { createProjectMutation };
};
