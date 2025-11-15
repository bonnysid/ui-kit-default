// .storybook/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { initUiKitI18n, UI_KIT_NS } from '../src/i18n';

i18n.use(initReactI18next).init({
  lng: 'ru', // дефолтный язык для сторибука
  fallbackLng: 'en',
  ns: [UI_KIT_NS],
  defaultNS: UI_KIT_NS,
  interpolation: {
    escapeValue: false,
  },
});

// добавляем ресурсы ui-kit (ru/en) в этот инстанс
initUiKitI18n(i18n);

export default i18n;
