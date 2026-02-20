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

export const getResumeResponseDtoSchema = resumeDtoSchema;

export class GetResumeResponseDto extends createZodDto(getResumeResponseDtoSchema) {}

export const getAllResumesResponseDtoSchema = z.array(getResumeResponseDtoSchema);

export class GetAllResumesResponseDto extends createZodDto(getAllResumesResponseDtoSchema) {}

export const createResumeRequestDtoSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().optional(),
  content: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export class CreateResumeRequestDto extends createZodDto(createResumeRequestDtoSchema) {}

export const createResumeResponseDtoSchema = resumeDtoSchema;

export class CreateResumeResponseDto extends createZodDto(createResumeResponseDtoSchema) {}

export const updateResumeSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().optional(),
  content: z.string(),
  isPublic: z.boolean().default(false),
});

export class UpdateResumeRequestDto extends createZodDto(updateResumeSchema) {}

export const setPublicResumeRequestDtoSchema = z.object({
  isPublic: z.boolean(),
});

export class SetPublicResumeRequestDto extends createZodDto(setPublicResumeRequestDtoSchema) {}
