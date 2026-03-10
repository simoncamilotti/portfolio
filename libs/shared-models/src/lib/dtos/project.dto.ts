import { createZodDto } from 'nestjs-zod';

import {
  createProjectRequestDtoSchema,
  projectDtoSchema,
  updateProjectRequestDtoSchema,
} from '../schemas/project.schema';

export class ProjectDto extends createZodDto(projectDtoSchema) {}

export class CreateProjectRequestDto extends createZodDto(createProjectRequestDtoSchema) {}

export class UpdateProjectRequestDto extends createZodDto(updateProjectRequestDtoSchema) {}
