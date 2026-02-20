import type { ResumeDto } from '@portfolio/shared-models';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resumesKey } from '../resumes.key';
import { ResumesService } from '../resumes.service';

export const useSetResumeIsPublic = (resumeId: string) => {
  const queryClient = useQueryClient();

  const setResumeIsPublic = useMutation({
    mutationFn: () => ResumesService.setResumeIsPublic(resumeId, { isPublic: true }),
    ...{
      onMutate: () => {
        queryClient.setQueryData<ResumeDto[]>(resumesKey.getAllResumes, data =>
          data?.map(resume => ({ ...resume, isPublic: resume.id === resumeId })),
        );
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: resumesKey.getAllResumes }),
      onError: async error => {
        queryClient.invalidateQueries({ queryKey: resumesKey.getAllResumes });
        throw error;
      },
    },
  });

  return {
    setResumeIsPublic,
  };
};
