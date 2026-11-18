import { zodResolver } from '@hookform/resolvers/zod';
import { useContactSendMessage } from '@repo/api-client';
import { contactRequestDtoSchema } from '@repo/contracts';
import type { BaseSyntheticEvent } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

const contactFormSchema = contactRequestDtoSchema.omit({ captchaToken: true });
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export type UseContactFormProps = {
  recaptchaSiteKey: string;
  setStatus: Dispatch<SetStateAction<FormStatus>>;
};

export const useContactForm = ({ recaptchaSiteKey, setStatus }: UseContactFormProps) => {
  const recaptchaLoaded = useRef(false);

  useEffect(() => {
    if (!recaptchaSiteKey || recaptchaLoaded.current) {
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    document.head.appendChild(script);
    recaptchaLoaded.current = true;
  }, [recaptchaSiteKey]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onTouched',
  });

  const sendContactMutation = useContactSendMessage();

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    setStatus('loading');

    try {
      let captchaToken = '';

      if (recaptchaSiteKey && window.grecaptcha) {
        captchaToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact' });
      }

      await sendContactMutation.mutateAsync({ data: { ...data, captchaToken } });

      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return {
    control,
    isValid,
    onSubmit: (form: BaseSyntheticEvent) => handleSubmit(onSubmit)(form),
  };
};
