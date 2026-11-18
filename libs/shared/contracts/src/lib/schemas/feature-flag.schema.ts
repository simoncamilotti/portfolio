import { z } from 'zod';

export const featureFlagDtoSchema = z
  .object({
    key: z.string(),
    enabled: z.boolean(),
  })
  .meta({ id: 'FeatureFlag' });

export const createFeatureFlagDtoRequestSchema = featureFlagDtoSchema;

export const updateFeatureFlagRequestDtoSchema = z
  .object({
    enabled: z.boolean(),
  })
  .meta({ id: 'FeatureFlagUpdate' });

export type FeatureFlagDto = z.infer<typeof featureFlagDtoSchema>;
export type CreateFeatureFlagRequestDto = z.infer<typeof createFeatureFlagDtoRequestSchema>;
export type UpdateFeatureFlagRequestDto = z.infer<typeof updateFeatureFlagRequestDtoSchema>;
