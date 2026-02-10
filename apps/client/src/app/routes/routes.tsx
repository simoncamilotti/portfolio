import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';

import { isAuthenticated, login } from '../modules/auth/auth';
import { Layout } from '../modules/layout/Layout';
import { HomePage } from '../pages/HomePage';
import { ResumePage } from '../pages/ResumePage';
import { RoutePaths } from './paths.const';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    hydrateFallbackElement: <div>Loading...</div>,
    loader: async ({ request }) => {
      if (!isAuthenticated()) {
        await login(request.url);
      }

      return null;
    },
    children: [
      {
        index: true,
        path: RoutePaths.HOME,
        element: <HomePage />,
      },
      {
        index: true,
        path: RoutePaths.RESUME,
        element: <ResumePage />,
      },
    ],
  },
  {
    path: '*',
    loader: () => redirect(RoutePaths.HOME),
  },
];
