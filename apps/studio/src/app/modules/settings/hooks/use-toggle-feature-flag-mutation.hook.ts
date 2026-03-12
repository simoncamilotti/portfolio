import type { FeatureFlagDto } from '@portfolio/shared-models';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { featureFlagsKey } from '../feature-flags.key';
import { FeatureFlagsService } from '../feature-flags.service';

export const useToggleFeatureFlagMutation = () => {
  const queryClient = useQueryClient();

  const toggleFeatureFlagMutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) => FeatureFlagsService.update(key, enabled),
    onMutate: ({ key, enabled }) => {
      queryClient.setQueryData<FeatureFlagDto[]>(featureFlagsKey.getAll, data =>
        data?.map(f => (f.key === key ? { ...f, enabled } : f)),
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: featureFlagsKey.getAll });
    },
  });

  return { toggleFeatureFlagMutation };
};
