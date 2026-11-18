import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { type AuthContextProps, useAuth } from 'react-oidc-context';

import { createAppRouter } from '../router.js';
import { createQueryClient } from './modules/providers/query-client.js';

const queryClient = createQueryClient();

export const App: FunctionComponent = () => {
  const auth = useAuth();

  // The routes decide on access: wait until the OIDC state is known, including the return
  // from the identity provider.
  if (auth.isLoading) {
    return null;
  }
  return <AppRouter auth={auth} />;
};

const AppRouter: FunctionComponent<{ auth: AuthContextProps }> = ({ auth }) => {
  // Created once the sign-in callback has restored the requested URL, so it starts there.
  const [router] = useState(() => createAppRouter(queryClient));

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ auth }} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};
