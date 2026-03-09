import { useQuery } from '@tanstack/react-query';

import { featureFlagsKey } from '../feature-flags.key';
import { FeatureFlagsService } from '../feature-flags.service';

export const useFeatureFlagsQuery = () => {
  return useQuery({
    queryKey: featureFlagsKey.getAll,
    queryFn: FeatureFlagsService.getAll,
  });
};
