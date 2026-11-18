import { Layout } from '@repo/ui';
import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';

import { RequireAuth } from '../../auth/require-auth.js';
import { Navbar } from '../modules/layout/navbar.js';
import { ForbiddenPage } from '../pages/forbidden-page.js';
import { HomePage } from '../pages/home-page.js';
import { ProjectsPage } from '../pages/projects-page.js';
import { ResumePage } from '../pages/resume-page.js';
import { ResumesPage } from '../pages/resumes-page.js';
import { SettingsPage } from '../pages/settings-page.js';
import { RoutePaths } from './paths.const.js';

export const routes: RouteObject[] = [
  {
    element: (
      <RequireAuth>
        <Layout navBar={<Navbar />} />
      </RequireAuth>
    ),
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
  // Outside the authenticated layout: its gate would send a refused user straight back to the
  // identity provider, in a loop, instead of showing why.
  {
    path: RoutePaths.ERROR_FORBIDDEN,
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    loader: () => redirect(RoutePaths.HOME),
  },
];
