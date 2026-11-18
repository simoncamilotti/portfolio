import { z } from 'zod';

/** Local account of the caller, refreshed from the claims of the access token. */
export const userDtoSchema = z
  .object({
    id: z.uuid(),
    email: z.email(),
    name: z.string(),
    locale: z.string(),
  })
  .meta({ id: 'User' });

export type UserDto = z.infer<typeof userDtoSchema>;
