import { QueryClientProvider } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { createQueryClient } from './modules/providers/query-client.js';
import { routes } from './routes/routes.js';

const queryClient = createQueryClient();

export const App: FunctionComponent = () => {
  const auth = useAuth();

  // The routes decide on access: wait until the OIDC state is known, including the return
  // from the identity provider.
  if (auth.isLoading) {
    return null;
  }
  return <AppRouter />;
};

const AppRouter: FunctionComponent = () => {
  // Created once the sign-in callback has restored the requested URL, so it starts there.
  const [router] = useState(() => createBrowserRouter(routes));

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};
