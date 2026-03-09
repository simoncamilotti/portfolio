import type { FeatureFlagDto } from '@portfolio/shared-models';

import { axiosInstance } from '../api/axiosInstance';

export const FeatureFlagsService = {
  getAll: (): Promise<FeatureFlagDto[]> =>
    axiosInstance.get<FeatureFlagDto[]>('feature-flags').then(({ data }) => data),
};
