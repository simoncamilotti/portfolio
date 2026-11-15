import { ReactQueryProvider } from '@repo/query';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router';

import { FeatureFlagsProvider } from './modules/feature-flags/providers/feature-flags-context.js';

export const App: FunctionComponent<{
  router: ReturnType<typeof createBrowserRouter>;
}> = ({ router }) => {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <FeatureFlagsProvider>
          <RouterProvider router={router} />
        </FeatureFlagsProvider>
      </ReactQueryProvider>
    </React.StrictMode>
  );
};
