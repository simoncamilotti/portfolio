import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';

import { Layout } from '../modules/layout/Layout';
import { HomePage } from '../pages/HomePage';
import { RoutePaths } from './paths.const';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [{ index: true, path: RoutePaths.HOME, element: <HomePage /> }],
  },
  { path: '*', loader: () => redirect(RoutePaths.HOME) },
];
