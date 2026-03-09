import { z } from 'zod';

export const resumeDtoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(3).max(50),
  description: z.string().optional(),
  isPublic: z.boolean(),
  shareEnabled: z.boolean(),
  updatedAt: z.string(),
  views: z.number().optional(),
  downloads: z.number().optional(),
});

export const resumeDetailDtoSchema = resumeDtoSchema.extend({
  content: z.unknown(),
});

export const createResumeRequestDtoSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().optional(),
  content: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export const updateResumeRequestDtoSchema = z.object({
  title: z.string().min(3).max(50).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const setPublicResumeRequestDtoSchema = z.object({
  isPublic: z.boolean(),
});

export type ResumeDto = z.infer<typeof resumeDtoSchema>;
export type ResumeDetailDto = z.infer<typeof resumeDetailDtoSchema>;
export type CreateResumeRequestDto = z.infer<typeof createResumeRequestDtoSchema>;
export type UpdateResumeRequestDto = z.infer<typeof updateResumeRequestDtoSchema>;
export type SetPublicResumeRequestDto = z.infer<typeof setPublicResumeRequestDtoSchema>;
