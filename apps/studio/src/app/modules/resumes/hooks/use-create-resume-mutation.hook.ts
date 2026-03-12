import type { ResumeDetailDto, ResumeDto } from '@portfolio/shared-models';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resumesKey } from '../resumes.key';
import { ResumesService } from '../resumes.service';

export const useCreateResumeMutationHook = () => {
  const queryClient = useQueryClient();

  const onSuccess = (createdResume: ResumeDetailDto) =>
    queryClient.setQueryData<ResumeDto[]>(resumesKey.getAllResumes, resumes => {
      const newItem: ResumeDto = {
        ...createdResume,
        updatedAt: new Date().toISOString(),
      };

      const olderItems =
        resumes?.map(resume => ({
          ...resume,
        })) ?? [];

      return [newItem, ...olderItems];
    });

  const createResumeMutation = useMutation({
    mutationFn: ResumesService.createResume,
    onSuccess,
  });

  return {
    createResumeMutation,
  };
};
