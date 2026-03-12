import { Layout } from '@portfolio/shared-ui';
import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';

import { Navbar } from '../modules/layout/Navbar';
import { HomePage } from '../pages/HomePage';
import { RoutePaths } from './paths.const';

export const routes: RouteObject[] = [
  {
    element: <Layout navBar={<Navbar />} />,
    children: [{ index: true, path: RoutePaths.HOME, element: <HomePage /> }],
  },
  { path: '*', loader: () => redirect(RoutePaths.HOME) },
];
