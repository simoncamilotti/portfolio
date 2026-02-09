import { z } from 'zod';

export const createResumeSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().optional(),
  content: z.string(),
  isPublic: z.boolean().default(false),
});

export type CreateResumeRequestDto = z.infer<typeof createResumeSchema>;
