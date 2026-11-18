import { createFileRoute } from '@tanstack/react-router';

import { ProjectsPage } from '../../app/pages/projects-page.js';

export const Route = createFileRoute('/_authenticated/projects')({
  component: ProjectsPage,
});
