import type { ResumeDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resumesKey } from '../resumes.key.js';
import { ResumesService } from '../resumes.service.js';

export const useSetResumeIsPublic = (resumeId: string) => {
  const queryClient = useQueryClient();

  const setResumeIsPublic = useMutation({
    mutationFn: () => ResumesService.setResumeIsPublic(resumeId, { isPublic: true }),
    ...{
      onMutate: () => {
        queryClient.setQueryData<ResumeDto[]>(resumesKey.getAllResumes, (data) =>
          data?.map((resume) => ({ ...resume, isPublic: resume.id === resumeId })),
        );
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: resumesKey.getAllResumes }),
      onError: async (error) => {
        queryClient.invalidateQueries({ queryKey: resumesKey.getAllResumes });
        throw error;
      },
    },
  });

  return {
    setResumeIsPublic,
  };
};
