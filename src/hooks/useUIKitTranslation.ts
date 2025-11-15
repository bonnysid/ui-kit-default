import { useTranslation } from 'react-i18next';
import { UI_KIT_NS } from '@/i18n';

export const useUIKitTranslation = () => {
  return useTranslation(UI_KIT_NS);
};
