import { getProjectFindAllQueryKey, projectRemove } from '@repo/api-client';
import type { ProjectDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteProjectMutation = (projectIdToDelete: string) => {
  const queryClient = useQueryClient();
  const queryKey = getProjectFindAllQueryKey();

  const deleteProjectMutation = useMutation({
    mutationFn: () => projectRemove(projectIdToDelete),
    onMutate: () => {
      queryClient.setQueryData<ProjectDto[]>(queryKey, (data) =>
        data?.filter(({ id }) => id !== projectIdToDelete),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: async (error) => {
      queryClient.invalidateQueries({ queryKey });
      throw error;
    },
  });

  return { deleteProjectMutation };
};
