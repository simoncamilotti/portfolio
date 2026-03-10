import { z } from 'zod';

const baseProjectSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().optional(),
  tags: z.array(z.string()),
  url: z.url().optional(),
  repoUrl: z.url().optional(),
  imageUrl: z.url().optional(),
});

export const projectDtoSchema = baseProjectSchema.extend({ id: z.uuid() });

export const createProjectRequestDtoSchema = baseProjectSchema;

export const updateProjectRequestDtoSchema = baseProjectSchema.partial();

export type ProjectDto = z.infer<typeof projectDtoSchema>;
export type CreateProjectRequestDto = z.infer<typeof createProjectRequestDtoSchema>;
export type UpdateProjectRequestDto = z.infer<typeof updateProjectRequestDtoSchema>;
