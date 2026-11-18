import { getProjectFindAllQueryKey, projectUpdate } from '@repo/api-client';
import type { ProjectDto, UpdateProjectRequestDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectRequestDto }) =>
      projectUpdate(projectId, data),
    onSuccess: (updatedProject: ProjectDto) => {
      queryClient.setQueryData<ProjectDto[]>(
        getProjectFindAllQueryKey(),
        (projects) => projects?.map((p) => (p.id === updatedProject.id ? updatedProject : p)) ?? [],
      );
    },
  });

  return { updateProjectMutation };
};
