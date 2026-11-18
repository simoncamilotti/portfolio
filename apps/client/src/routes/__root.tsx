import { Layout } from '@repo/ui';
import { createRootRoute, Navigate, Outlet } from '@tanstack/react-router';

import { Navbar } from '../app/modules/layout/navbar.js';

export const Route = createRootRoute({
  component: RootLayout,
  // Unknown paths go back home.
  notFoundComponent: () => <Navigate to="/" replace />,
});

function RootLayout() {
  return (
    <Layout navBar={<Navbar />}>
      <Outlet />
    </Layout>
  );
}
