import type { FunctionComponent, ReactNode } from 'react';
import { createContext, useMemo } from 'react';

import { useFeatureFlagsQuery } from '../hooks/use-feature-flags-query.hook';

export type FeatureFlagsContextValue = {
  isEnabled: (key: string) => boolean;
  loading: boolean;
};

export const FeatureFlagsContext = createContext<FeatureFlagsContextValue>({
  isEnabled: () => false,
  loading: true,
});

export const FeatureFlagsProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { data: flags, isPending } = useFeatureFlagsQuery();

  const value = useMemo<FeatureFlagsContextValue>(() => {
    const map: Record<string, boolean> = {};
    for (const flag of flags ?? []) {
      map[flag.key] = flag.enabled;
    }
    return {
      isEnabled: (key: string) => map[key] ?? false,
      loading: isPending,
    };
  }, [flags, isPending]);

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
};
