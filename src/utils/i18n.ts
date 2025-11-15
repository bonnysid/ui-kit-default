import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import ruCommon from '../locales/ru/common.json';

await i18next.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    en: { common: enCommon },
    ru: { common: ruCommon },
  },
  interpolation: { escapeValue: false },
});

export { i18next };
export default i18next;
