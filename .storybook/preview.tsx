import type { Preview } from '@storybook/react-vite';

import '@/assets/global.module.scss';
import '@/assets/variables.module.scss';
import i18n from './i18n';

const THEME_STORAGE_KEY = 'sb-ui-theme';

const preview: Preview = {
  parameters: {
    layout: 'centered', // <-- убирает стандартные отступы вокруг сторей
    backgrounds: {
      options: {
        main: { name: 'main', value: 'var(--color-bg-secondary)' },
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'UI theme',
      defaultValue: (() => localStorage.getItem(THEME_STORAGE_KEY) ?? 'light')(),
      toolbar: {
        icon: 'mirror', // или 'sun'
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
          { value: 'system', icon: 'browser', title: 'System' },
        ],
      },
    },
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'ru',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'ru', right: '🇷🇺', title: 'Русский' },
          { value: 'en', right: '🇬🇧', title: 'English' },
        ],
      },
    },
  },

  decorators: [
    (Story, { globals }) => {
      const { locale } = globals;
      i18n.changeLanguage(locale);
      // Определяем итоговую тему
      const resolved =
        globals.theme === 'system'
          ? window.matchMedia?.('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : globals.theme;

      // Ставим атрибут на html внутри iframe превью (и docs)
      const root = document.documentElement;
      root.setAttribute('data-theme', resolved);

      // Поддержка live-переключения системной темы
      const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
      const onChange = () => {
        if (globals.theme === 'system') {
          root.setAttribute('data-theme', mql.matches ? 'dark' : 'light');
        }
      };
      mql?.addEventListener?.('change', onChange);

      // Сохраняем выбор (кроме system — чтобы не путать)
      if (globals.theme === 'light' || globals.theme === 'dark') {
        localStorage.setItem(THEME_STORAGE_KEY, globals.theme);
      } else {
        localStorage.removeItem(THEME_STORAGE_KEY);
      }

      // Тянем фон/цвет из твоих токенов, чтобы «канвас» выглядел как приложение
      return <Story />;
    },
  ],

  initialGlobals: {
    // 👇 Set the initial background color
    backgrounds: { value: 'main' },
  },
};

export default preview;
