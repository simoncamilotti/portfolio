import { createZodDto } from 'nestjs-zod';

import { contactRequestDtoSchema } from './contact.schema';

export { contactRequestDtoSchema } from './contact.schema';

export class ContactRequestDto extends createZodDto(contactRequestDtoSchema) {}
