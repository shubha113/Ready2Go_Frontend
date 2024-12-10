import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../Frontend/Locales/en.json';
import hiTranslations from '../Frontend/Locales/hi.json';
import paTranslations from '../Frontend/Locales/pa.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      pa: { translation: paTranslations }
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;