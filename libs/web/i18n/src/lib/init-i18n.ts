import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { client as enClient } from '../locales/en/client.js';
import { common as enCommon } from '../locales/en/common.js';
import { studio as enStudio } from '../locales/en/studio.js';
import { client, type ClientTranslations } from '../locales/fr/client.js';
import { common, type CommonTranslations } from '../locales/fr/common.js';
import { studio, type StudioTranslations } from '../locales/fr/studio.js';

const LANGUAGES = ['fr', 'en'] as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    // Typed keys: `t('footer.copyright')` compiles, a misspelt key does not.
    resources: {
      common: CommonTranslations;
      client: ClientTranslations;
      studio: StudioTranslations;
    };
  }
}

await i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { common, client, studio },
      en: { common: enCommon, client: enClient, studio: enStudio },
    },
    supportedLngs: LANGUAGES,
    fallbackLng: 'fr',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  });

document.documentElement.lang = i18n.resolvedLanguage ?? 'fr';
i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
});
