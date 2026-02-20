export const RoutePathParams = {
  RESUME_ID: 'resumeId',
} as const;

export const RoutePaths = {
  HOME: '/',
  RESUME: `/resumes/:${RoutePathParams.RESUME_ID}`,
  ERROR_FORBIDDEN: '/forbidden',
} as const;

export const RouteNames = {
  HOME: 'Accueil',
  RESUME: 'Cv',
} as const;
