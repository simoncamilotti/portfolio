import { createRootRouteWithContext, Navigate, Outlet } from '@tanstack/react-router';

import type { RouterContext } from '../router.js';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  // Unknown paths go back home.
  notFoundComponent: () => <Navigate to="/" replace />,
});
