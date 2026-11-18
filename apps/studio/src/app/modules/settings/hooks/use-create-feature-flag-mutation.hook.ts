import { featureFlagCreate, getFeatureFlagFindAllQueryKey } from '@repo/api-client';
import type { FeatureFlagDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateFeatureFlagMutation = () => {
  const queryClient = useQueryClient();

  const createFeatureFlagMutation = useMutation({
    mutationFn: (key: string) => featureFlagCreate({ key, enabled: false }),
    onSuccess: (created: FeatureFlagDto) => {
      queryClient.setQueryData<FeatureFlagDto[]>(getFeatureFlagFindAllQueryKey(), (data) => [
        ...(data ?? []),
        created,
      ]);
    },
  });

  return { createFeatureFlagMutation };
};
