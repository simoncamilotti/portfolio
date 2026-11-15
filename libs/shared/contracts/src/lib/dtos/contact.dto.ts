import { createZodDto } from 'nestjs-zod';

import { contactRequestDtoSchema } from '../schemas/contact.schema.js';

export class ContactRequestDto extends createZodDto(contactRequestDtoSchema) {}
