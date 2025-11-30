import { useTranslation } from 'react-i18next';
import { getUiKitI18n, UI_KIT_NS } from '@/i18n';

export const useUIKitTranslation = () => {
  const i18n = getUiKitI18n();

  return useTranslation(UI_KIT_NS, { i18n });
};
