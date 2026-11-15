import type { ContactRequestDto } from '@repo/contracts';

import { axiosInstance } from '../api/axios-instance.js';

export const ContactService = {
  send: (dto: ContactRequestDto) => axiosInstance.post('contact', dto),
};
