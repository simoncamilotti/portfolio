import { getResumeFindAllQueryKey, resumeCreate } from '@repo/api-client';
import type { CreateResumeRequestDto, ResumeDetailDto, ResumeDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateResumeMutationHook = () => {
  const queryClient = useQueryClient();

  const onSuccess = (createdResume: ResumeDetailDto) =>
    queryClient.setQueryData<ResumeDto[]>(getResumeFindAllQueryKey(), (resumes) => {
      const newItem: ResumeDto = {
        ...createdResume,
        updatedAt: new Date().toISOString(),
      };

      const olderItems =
        resumes?.map((resume) => ({
          ...resume,
        })) ?? [];

      return [newItem, ...olderItems];
    });

  const createResumeMutation = useMutation({
    mutationFn: (resume: CreateResumeRequestDto) => resumeCreate(resume),
    onSuccess,
  });

  return {
    createResumeMutation,
  };
};
