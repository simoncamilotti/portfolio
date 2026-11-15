import { Layout } from '@repo/ui';
import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';

import { isAuthenticated, login } from '../modules/auth/auth.js';
import { Navbar } from '../modules/layout/Navbar.js';
import { HomePage } from '../pages/HomePage.js';
import { ProjectsPage } from '../pages/ProjectsPage.js';
import { ResumePage } from '../pages/ResumePage.js';
import { ResumesPage } from '../pages/ResumesPage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { RoutePaths } from './paths.const.js';

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
