import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enClient from '../locales/en/client.json';
import enCommon from '../locales/en/common.json';
import enStudio from '../locales/en/studio.json';
import frClient from '../locales/fr/client.json';
import frCommon from '../locales/fr/common.json';
import frStudio from '../locales/fr/studio.json';

const resources = {
  fr: { common: frCommon, client: frClient, studio: frStudio },
  en: { common: enCommon, client: enClient, studio: enStudio },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
