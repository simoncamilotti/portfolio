import { useMutation } from '@tanstack/react-query';

import { ContactService } from '../contact.service';

export const useContactFormMutation = () => {
  const sendContactMutation = useMutation({
    mutationFn: ContactService.send,
  });

  return {
    sendContactMutation,
  };
};
