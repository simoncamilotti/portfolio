import type { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import type { FormStatus } from '../hooks/use-contact-form.hook';

type ContactSuccessProps = {
  setStatus: Dispatch<SetStateAction<FormStatus>>;
};

export const ContactSuccess: FunctionComponent<ContactSuccessProps> = ({ setStatus }) => {
  const { t } = useTranslation('client');
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <p className="text-sm text-foreground font-medium">{t('contact.success.title')}</p>
      <p className="text-sm text-muted-foreground mt-2">{t('contact.success.description')}</p>
      <button
        type="button"
        onClick={() => setStatus('idle')}
        className="mt-4 px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        {t('contact.success.another')}
      </button>
    </div>
  );
};
