import type { ContactRequestDto } from '@portfolio/shared-models';

import { axiosInstance } from '../api/axiosInstance';

export const ContactService = {
  send: (dto: ContactRequestDto) => axiosInstance.post('contact', dto),
};
