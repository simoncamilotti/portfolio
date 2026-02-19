import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { resumeDtoSchema } from './resume.dto';

export const getAllResumesResponseDtoSchema = z.array(resumeDtoSchema);

export class GetAllResumesResponseDto extends createZodDto(getAllResumesResponseDtoSchema) {}
