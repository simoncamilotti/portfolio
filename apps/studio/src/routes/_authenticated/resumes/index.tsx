import { createFileRoute } from '@tanstack/react-router';

import { ResumesPage } from '../../../app/pages/resumes-page.js';

export const Route = createFileRoute('/_authenticated/resumes/')({
  component: ResumesPage,
});
