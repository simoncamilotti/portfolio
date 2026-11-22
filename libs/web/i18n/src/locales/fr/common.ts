export const common = {
  footer: {
    copyright: '© {{year}} Portfolio. Tous droits réservés.',
    madeWith: 'Conçu avec <heart>♥</heart> et beaucoup de café',
  },
  dialog: {
    close: 'Fermer',
  },
  loading: 'Chargement...',
  language: {
    fr: 'FR',
    en: 'EN',
  },
};

/** Shape of the `common` namespace: French is the reference, English must match it. */
export type CommonTranslations = typeof common;
