import { z } from 'zod';

export const createResumeFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export type CreateResumeForm = z.infer<typeof createResumeFormSchema>;
