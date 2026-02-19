export const resumesRootKey = 'resumes';

export const resumesKey: Record<string, any> = {
  getAllResumes: [resumesRootKey, 'getAllResumes'] as const,
};
