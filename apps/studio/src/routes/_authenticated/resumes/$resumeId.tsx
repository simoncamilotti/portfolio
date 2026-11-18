import { createFileRoute } from '@tanstack/react-router';

import { ResumePage } from '../../../app/pages/resume-page.js';

export const Route = createFileRoute('/_authenticated/resumes/$resumeId')({
  component: ResumePage,
});
