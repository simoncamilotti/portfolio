import { motion } from 'framer-motion';
import { type FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteAnchors } from '../../../routes/paths.const';
import type { FormStatus } from '../hooks/use-contact-form.hook';
import { ContactForm } from './ContactForm';
import { ContactSuccess } from './ContactSuccess';

export const ContactSection: FunctionComponent = () => {
  const { t } = useTranslation('client');
  const [status, setStatus] = useState<FormStatus>('idle');

  return (
    <section id={RouteAnchors.HOME.CONTACT} className="py-24 border-t border-border/50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-10">
            {t('contact.title')}
          </h2>
          <p className="text-muted-foreground text-sm mb-10">{t('contact.description')}</p>

          <div className="max-w-2xl">
            {status === 'success' ? (
              <ContactSuccess setStatus={setStatus} />
            ) : (
              <ContactForm status={status} setStatus={setStatus} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
