import { QueryClientProvider } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router';

import { createQueryClient } from './modules/providers/query-client.js';

import { FeatureFlagsProvider } from './modules/feature-flags/providers/feature-flags-context.js';

const queryClient = createQueryClient();

export const App: FunctionComponent<{
  router: ReturnType<typeof createBrowserRouter>;
}> = ({ router }) => {
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
