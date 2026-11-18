import { featureFlagUpdate, getFeatureFlagFindAllQueryKey } from '@repo/api-client';
import type { FeatureFlagDto } from '@repo/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleFeatureFlagMutation = () => {
  const queryClient = useQueryClient();
  const queryKey = getFeatureFlagFindAllQueryKey();

  const toggleFeatureFlagMutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      featureFlagUpdate(key, { enabled }),
    onMutate: ({ key, enabled }) => {
      queryClient.setQueryData<FeatureFlagDto[]>(queryKey, (data) =>
        data?.map((f) => (f.key === key ? { ...f, enabled } : f)),
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { toggleFeatureFlagMutation };
};
