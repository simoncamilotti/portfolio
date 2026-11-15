import { useContext } from 'react';

import type { FeatureFlagsContextValue } from '../providers/FeatureFlagsContext.js';
import { FeatureFlagsContext } from '../providers/FeatureFlagsContext.js';

export const useFeatureFlags = (): FeatureFlagsContextValue => useContext(FeatureFlagsContext);
