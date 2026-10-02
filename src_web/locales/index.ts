import { th, LocaleTranslations } from './th';
import { en } from './en';

export type Language = 'th' | 'en';

export const locales = {
  th,
  en,
} as const;

export { th, en };
export type { LocaleTranslations };

export const getTranslation = (lang: Language): LocaleTranslations => {
  return (locales[lang] || locales.th) as LocaleTranslations;
};
