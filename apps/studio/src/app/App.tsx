import type { FunctionComponent } from 'react';
import React from 'react';
import type { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router';

import { ReactQueryProvider } from './lib/ReactQueryProvider';

export const App: FunctionComponent<{
  router: ReturnType<typeof createBrowserRouter>;
}> = ({ router }) => {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <div className="dark">
          <RouterProvider router={router} />
        </div>
      </ReactQueryProvider>
    </React.StrictMode>
  );
};
