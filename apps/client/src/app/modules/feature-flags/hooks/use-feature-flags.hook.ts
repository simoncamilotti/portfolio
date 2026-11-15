import { useContext } from 'react';

import type { FeatureFlagsContextValue } from '../providers/feature-flags-context.js';
import { FeatureFlagsContext } from '../providers/feature-flags-context.js';

export const useFeatureFlags = (): FeatureFlagsContextValue => useContext(FeatureFlagsContext);
