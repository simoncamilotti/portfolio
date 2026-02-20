import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resumesKey } from '../resumes.key';
import { ResumesService } from '../resumes.service';

export const useDeleteResumeById = (resumeIdToDelete: string) => {
  const queryClient = useQueryClient();

  const deleteResumeByIdMutation = useMutation({
    mutationFn: () => ResumesService.deleteResumeById(resumeIdToDelete),
    ...{
      onMutate: () => {
        queryClient.setQueryData<any[]>(resumesKey.getAllResumes, data =>
          data?.filter(({ id: resumeIdToKeep }) => resumeIdToKeep !== resumeIdToDelete),
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
    deleteResumeByIdMutation,
  };
};
