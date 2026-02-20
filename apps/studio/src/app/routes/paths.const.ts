export const RoutePathParams = {
  RESUME_ID: 'resumeId',
} as const;

export const RoutePaths = {
  DASHBOARD: '/',
  RESUME: `/resumes/:${RoutePathParams.RESUME_ID}`,
  ERROR_FORBIDDEN: '/forbidden',
} as const;
