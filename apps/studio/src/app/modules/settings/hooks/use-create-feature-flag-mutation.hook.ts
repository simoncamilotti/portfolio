import type { FeatureFlagDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { featureFlagsKey } from '../feature-flags.key.js';
import { FeatureFlagsService } from '../feature-flags.service.js';

export const useCreateFeatureFlagMutation = () => {
  const queryClient = useQueryClient();

  const createFeatureFlagMutation = useMutation({
    mutationFn: (key: string) => FeatureFlagsService.create(key, false),
    onSuccess: (created: FeatureFlagDto) => {
      queryClient.setQueryData<FeatureFlagDto[]>(featureFlagsKey.getAll, (data) => [
        ...(data ?? []),
        created,
      ]);
    },
  });

  return { createFeatureFlagMutation };
};
