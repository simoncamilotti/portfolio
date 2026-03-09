import { createZodDto } from 'nestjs-zod';

import { contactRequestDtoSchema } from '../schemas/contact.schema';

export class ContactRequestDto extends createZodDto(contactRequestDtoSchema) {}
