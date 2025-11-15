import type { i18n as I18nInstance } from 'i18next';

import enUiKit from '../locales/en/ui-kit.json';
import ruUiKit from '../locales/ru/ui-kit.json';

export const UI_KIT_NS = 'ui-kit';

export const uiKitResources = {
  en: { [UI_KIT_NS]: enUiKit },
  ru: { [UI_KIT_NS]: ruUiKit },
} as const;

export const initUiKitI18n = (i18n: I18nInstance) => {
  Object.entries(uiKitResources).forEach(([lng, resources]) => {
    const ns = UI_KIT_NS;

    i18n.addResourceBundle(
      lng,
      ns,
      resources[ns],
      true, // merge
      true, // overwrite
    );
  });
};
