import { getResumeFindAllQueryKey, resumeSetPublic } from '@repo/api-client';
import type { ResumeDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSetResumeIsPublic = (resumeId: string) => {
  const queryClient = useQueryClient();
  const queryKey = getResumeFindAllQueryKey();

  const setResumeIsPublic = useMutation({
    mutationFn: () => resumeSetPublic(resumeId, { isPublic: true }),
    onMutate: () => {
      queryClient.setQueryData<ResumeDto[]>(queryKey, (data) =>
        data?.map((resume) => ({ ...resume, isPublic: resume.id === resumeId })),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: async (error) => {
      queryClient.invalidateQueries({ queryKey });
      throw error;
    },
  });

  return {
    setResumeIsPublic,
  };
};
