import { createFileRoute } from '@tanstack/react-router';

import { ForbiddenPage } from '../app/pages/forbidden-page.js';

// Outside the authenticated layout: its gate would send a refused user straight back to the
// identity provider, in a loop, instead of showing why.
export const Route = createFileRoute('/forbidden')({
  component: ForbiddenPage,
});
