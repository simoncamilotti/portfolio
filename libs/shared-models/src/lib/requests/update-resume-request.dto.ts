import { z } from 'zod';

export const updateResumeSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().optional(),
  content: z.string(),
  isPublic: z.boolean().default(false),
});

export type UpdateResumeRequestDto = z.infer<typeof updateResumeSchema>;
