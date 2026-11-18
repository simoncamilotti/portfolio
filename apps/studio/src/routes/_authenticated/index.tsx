import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '../../app/pages/home-page.js';

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
});
