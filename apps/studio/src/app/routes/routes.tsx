import { Layout } from '@portfolio/shared-ui';
import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';

import { isAuthenticated, login } from '../modules/auth/auth';
import { Navbar } from '../modules/layout/Navbar';
import { HomePage } from '../pages/HomePage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ResumePage } from '../pages/ResumePage';
import { ResumesPage } from '../pages/ResumesPage';
import { SettingsPage } from '../pages/SettingsPage';
import { RoutePaths } from './paths.const';

export const routes: RouteObject[] = [
  {
    element: <Layout navBar={<Navbar />} />,
    hydrateFallbackElement: <div>Loading...</div>,
    loader: async ({ request }) => {
      if (!isAuthenticated()) {
        await login(request.url);
      }

      return null;
    },
    children: [
      {
        path: RoutePaths.HOME,
        element: <HomePage />,
      },
      {
        path: RoutePaths.RESUMES,
        element: <ResumesPage />,
      },
      {
        path: RoutePaths.RESUME,
        element: <ResumePage />,
      },
      {
        path: RoutePaths.PROJECTS,
        element: <ProjectsPage />,
      },
      {
        path: RoutePaths.SETTINGS,
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    loader: () => redirect(RoutePaths.HOME),
  },
];
