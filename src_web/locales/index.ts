import { th } from './th';
import { en } from './en';

export type Language = 'th' | 'en';
export type LocaleTranslations = typeof th;

export const locales = {
  th,
  en,
} as const;

export { th, en };

export const getTranslation = (lang: Language): LocaleTranslations => {
  return (locales[lang] || locales.th) as LocaleTranslations;
};

export const getTagLabel = (tag: { labelTh: string; labelEn: string }, lang: Language): string => {
  return lang === 'th' ? tag.labelTh : tag.labelEn;
};

export const getLocalizedText = <T extends { th: string; en: string }>(item: T, lang: Language): string => {
  return item[lang] || item.th;
};

export const getReframingText = (
  insight: {
    reflectionTh: string;
    reflectionEn: string;
    microActionTh: string;
    microActionEn: string;
    biologyFactTh: string;
    biologyFactEn: string;
  },
  field: 'reflection' | 'biologyFact' | 'microAction',
  lang: Language
): string => {
  if (field === 'reflection') return lang === 'th' ? insight.reflectionTh : insight.reflectionEn;
  if (field === 'biologyFact') return lang === 'th' ? insight.biologyFactTh : insight.biologyFactEn;
  return lang === 'th' ? insight.microActionTh : insight.microActionEn;
};
