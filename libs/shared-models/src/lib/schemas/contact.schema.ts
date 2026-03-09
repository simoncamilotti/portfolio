import { z } from 'zod';

export const contactRequestDtoSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, '100 caractères maximum'),
  email: z.email('Adresse email invalide').max(255, '255 caractères maximum'),
  subject: z.string().min(1, 'Le sujet est requis').max(200, '200 caractères maximum'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000, '5000 caractères maximum'),
  captchaToken: z.string().min(1),
});

export type ContactRequestDto = z.infer<typeof contactRequestDtoSchema>;
