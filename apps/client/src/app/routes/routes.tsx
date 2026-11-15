import { Layout } from '@repo/ui';
import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';

import { Navbar } from '../modules/layout/navbar.js';
import { HomePage } from '../pages/home-page.js';
import { RoutePaths } from './paths.const.js';

export const routes: RouteObject[] = [
  {
    element: <Layout navBar={<Navbar />} />,
    children: [{ index: true, path: RoutePaths.HOME, element: <HomePage /> }],
  },
  { path: '*', loader: () => redirect(RoutePaths.HOME) },
];
