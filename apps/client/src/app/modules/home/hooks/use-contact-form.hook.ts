import { zodResolver } from '@hookform/resolvers/zod';
import { contactRequestDtoSchema } from '@portfolio/shared-models/schemas';
import type { BaseSyntheticEvent } from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useContactFormMutation } from './use-contact-form-mutation.hook';

const contactFormSchema = contactRequestDtoSchema.omit({ captchaToken: true });
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export type UseContactFormProps = {
  recaptchaSiteKey: string;
};

export const useContactForm = ({ recaptchaSiteKey }: UseContactFormProps) => {
  const [status, setStatus] = useState<FormStatus>('idle');
  const recaptchaLoaded = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onTouched',
  });

  const { sendContactMutation } = useContactFormMutation();

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    setStatus('loading');

    try {
      let captchaToken = '';

      if (recaptchaSiteKey && window.grecaptcha) {
        captchaToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact' });
      }

      await sendContactMutation.mutateAsync({ ...data, captchaToken });

      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return {
    status,
    setStatus,
    recaptchaLoaded,
    control,
    isValid,
    onSubmit: (form: BaseSyntheticEvent) => handleSubmit(onSubmit)(form),
  };
};
