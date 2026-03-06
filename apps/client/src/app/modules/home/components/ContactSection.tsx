import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { type FunctionComponent, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { RouteAnchors } from '../../../routes/paths.const';
import { useContactForm } from '../hooks/use-contact-form.hook';

export const ContactSection: FunctionComponent = () => {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const { status, setStatus, isValid, recaptchaLoaded, control, onSubmit } = useContactForm({
    recaptchaSiteKey,
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
    <section id={RouteAnchors.HOME.CONTACT} className="py-24 border-t border-border/50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-10">Contact</h2>
          <p className="text-muted-foreground text-sm mb-10">
            Une question, une proposition ? N'hésitez pas à me contacter.
          </p>

          <div className="max-w-2xl">
            {status === 'success' ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-sm text-foreground font-medium">Message envoy&eacute; avec succ&egrave;s !</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Merci pour votre message. Je vous r&eacute;pondrai dans les plus brefs d&eacute;lais.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
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
                            placeholder="Votre nom"
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                          />
                          {fieldState.error && (
                            <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                          )}
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
                            placeholder="Votre email"
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                          />
                          {fieldState.error && (
                            <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                          )}
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
                            placeholder="Sujet"
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                          />
                          {fieldState.error && (
                            <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                          )}
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
                          placeholder="Votre message"
                          rows={5}
                          {...field}
                          required
                          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
                        />
                        {fieldState.error && (
                          <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-destructive">
                    Une erreur est survenue. Veuillez r&eacute;essayer plus tard.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!isValid || status === 'loading'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Envoyer
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
