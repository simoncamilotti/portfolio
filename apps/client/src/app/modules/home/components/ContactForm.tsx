import { Loader2, Send } from 'lucide-react';
import type { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { type FormStatus, useContactForm } from '../hooks/use-contact-form.hook';

type ContactFormProps = {
  status: FormStatus;
  setStatus: Dispatch<SetStateAction<FormStatus>>;
};

export const ContactForm: FunctionComponent<ContactFormProps> = ({ status, setStatus }) => {
  const { t } = useTranslation('client');
  const recaptchaSiteKey = window.config.captcha.siteKey;

  const { isValid, recaptchaLoaded, control, onSubmit } = useContactForm({
    recaptchaSiteKey,
    setStatus,
  });

  useEffect(() => {
    if (!recaptchaSiteKey || recaptchaLoaded.current) {
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    document.head.appendChild(script);
    recaptchaLoaded.current = true;
  }, [recaptchaSiteKey, recaptchaLoaded]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Controller
            name={'name'}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <input
                  type="text"
                  {...field}
                  required
                  placeholder={t('contact.form.name')}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
                {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name={'email'}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <input
                  type="email"
                  {...field}
                  required
                  placeholder={t('contact.form.email')}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
                {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>
      </div>
      <div>
        <div>
          <Controller
            name={'subject'}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <input
                  type="text"
                  {...field}
                  required
                  placeholder={t('contact.form.subject')}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
                {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>
      </div>
      <div>
        <Controller
          name={'message'}
          control={control}
          render={({ field, fieldState }) => (
            <>
              <textarea
                placeholder={t('contact.form.message')}
                rows={5}
                {...field}
                required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
              />
              {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{t('contact.error')}</p>}

      <button
        type="submit"
        disabled={!isValid || status === 'loading'}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {t('contact.form.submit')}
      </button>
    </form>
  );
};
