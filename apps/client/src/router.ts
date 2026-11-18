import { createRouter } from '@tanstack/react-router';

import { routeTree } from './route-tree.gen.js';

export function createAppRouter() {
  return createRouter({ routeTree, scrollRestoration: true });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
