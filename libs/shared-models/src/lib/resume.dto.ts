import { createZodDto } from 'nestjs-zod';
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

export class ResumeDto extends createZodDto(resumeDtoSchema) {}
