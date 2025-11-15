import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'ru'],
  extract: {
    input: ['src/**/*.{js,jsx,ts,tsx}'],
    output: 'src/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'common',
    primaryLanguage: 'ru',
    secondaryLanguages: ['en'],
    ignore: ['node_modules/**'],
  },
  types: {
    input: ['src/locales/en/*.json'],
    output: 'src/types/i18next.d.ts',
  },
});
