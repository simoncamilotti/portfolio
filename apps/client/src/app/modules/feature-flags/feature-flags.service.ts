import type { FeatureFlagDto } from '@repo/contracts';

import { axiosInstance } from '../api/axiosInstance.js';

export const FeatureFlagsService = {
  getAll: (): Promise<FeatureFlagDto[]> =>
    axiosInstance.get<FeatureFlagDto[]>('feature-flags').then(({ data }) => data),
};
