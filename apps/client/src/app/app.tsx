import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import type { FunctionComponent } from 'react';
import React from 'react';

import { createAppRouter } from '../router.js';
import { FeatureFlagsProvider } from './modules/feature-flags/providers/feature-flags-context.js';
import { createQueryClient } from './modules/providers/query-client.js';

const queryClient = createQueryClient();
const router = createAppRouter();

export const App: FunctionComponent = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <FeatureFlagsProvider>
          <RouterProvider router={router} />
        </FeatureFlagsProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
