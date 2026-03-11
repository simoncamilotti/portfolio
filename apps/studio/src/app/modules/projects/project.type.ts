import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().optional(),
  tags: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
});

export type ProjectForm = z.infer<typeof projectFormSchema>;
