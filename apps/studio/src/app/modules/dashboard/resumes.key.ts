export const resumesRootKey = 'resumes';

export const resumesKey = {
  getAllResumes: [resumesRootKey, 'getAllResumes'] as const,
  getResumeById: (resumeId: string) => [resumesRootKey, 'getResume', resumeId] as const,
};
