import { createZodDto } from 'nestjs-zod';

import { featureFlagDtoSchema, updateFeatureFlagRequestDtoSchema } from '../schemas/feature-flag.schema';

export class FeatureFlagDto extends createZodDto(featureFlagDtoSchema) {}

export class UpdateFeatureFlagRequestDto extends createZodDto(updateFeatureFlagRequestDtoSchema) {}
