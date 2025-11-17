import { getTheme } from '@/utils';
import { usePersistedState } from './usePersistedState';

export type UseThemeProps = {
  initialTheme?: string;
  storageKey?: string;
};

export const useTheme = (props?: UseThemeProps) => {
  const [theme, setTheme] = usePersistedState({
    key: props?.storageKey || 'theme',
    initialValue: props?.initialTheme || getTheme(),
  });

  return { theme, setTheme };
};
