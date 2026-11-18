import { getResumeFindAllQueryKey, resumeRemove } from '@repo/api-client';
import type { ResumeDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteResumeById = (resumeIdToDelete: string) => {
  const queryClient = useQueryClient();
  const queryKey = getResumeFindAllQueryKey();

  const deleteResumeByIdMutation = useMutation({
    mutationFn: () => resumeRemove(resumeIdToDelete),
    onMutate: () => {
      queryClient.setQueryData<ResumeDto[]>(queryKey, (data) =>
        data?.filter(({ id: resumeIdToKeep }) => resumeIdToKeep !== resumeIdToDelete),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: async (error) => {
      queryClient.invalidateQueries({ queryKey });
      throw error;
    },
  });

  return {
    deleteResumeByIdMutation,
  };
};
