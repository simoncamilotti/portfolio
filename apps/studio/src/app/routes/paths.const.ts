export const RoutePathParams = {
  RESUME_ID: 'resumeId',
} as const;

export const RoutePaths = {
  HOME: '/',
  RESUMES: '/resumes',
  RESUME: `/resumes/:${RoutePathParams.RESUME_ID}`,
  PROJECTS: '/projects',
  SETTINGS: '/settings',
  ERROR_FORBIDDEN: '/forbidden',
} as const;

export const RouteNames = {
  HOME: 'nav.home',
  RESUMES: 'nav.resumes',
  RESUME: 'nav.resume',
  PROJECTS: 'nav.projects',
  SETTINGS: 'nav.settings',
} as const;
