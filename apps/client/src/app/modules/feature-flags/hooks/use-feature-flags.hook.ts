import { useContext } from 'react';

import type { FeatureFlagsContextValue } from '../providers/FeatureFlagsContext';
import { FeatureFlagsContext } from '../providers/FeatureFlagsContext';

export const useFeatureFlags = (): FeatureFlagsContextValue => useContext(FeatureFlagsContext);
