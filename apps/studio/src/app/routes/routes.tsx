import { Layout } from '@repo/ui';
import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';

import { isAuthenticated, login } from '../modules/auth/auth.js';
import { Navbar } from '../modules/layout/navbar.js';
import { HomePage } from '../pages/home-page.js';
import { ProjectsPage } from '../pages/projects-page.js';
import { ResumePage } from '../pages/resume-page.js';
import { ResumesPage } from '../pages/resumes-page.js';
import { SettingsPage } from '../pages/settings-page.js';
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
