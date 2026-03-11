export const projectsRootKey = 'projects';

export const projectsKey = {
  getAllProjects: [projectsRootKey, 'getAllProjects'] as const,
  getProjectById: (projectId: string) => [projectsRootKey, 'getProject', projectId] as const,
};
