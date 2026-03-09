import { createZodDto } from 'nestjs-zod';

import {
  createResumeRequestDtoSchema,
  resumeDetailDtoSchema,
  resumeDtoSchema,
  setPublicResumeRequestDtoSchema,
  updateResumeRequestDtoSchema,
} from '../schemas/resume.schema';

export class ResumeDto extends createZodDto(resumeDtoSchema) {}

export class ResumeDetailDto extends createZodDto(resumeDetailDtoSchema) {}

export class CreateResumeRequestDto extends createZodDto(createResumeRequestDtoSchema) {}

export class UpdateResumeRequestDto extends createZodDto(updateResumeRequestDtoSchema) {}

export class SetPublicResumeRequestDto extends createZodDto(setPublicResumeRequestDtoSchema) {}
