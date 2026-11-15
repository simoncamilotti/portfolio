import { useQuery } from '@tanstack/react-query';

import { featureFlagsKey } from '../feature-flags.key.js';
import { FeatureFlagsService } from '../feature-flags.service.js';

export const useFeatureFlagsQuery = () => {
  return useQuery({
    queryKey: featureFlagsKey.getAll,
    queryFn: FeatureFlagsService.getAll,
  });
};
