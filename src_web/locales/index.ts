import { th } from './th';
import { en } from './en';


export const LANG = {
  TH: 'th',
  EN: 'en',
} as const;

export type Language = typeof LANG[keyof typeof LANG];
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
  return lang === LANG.TH ? tag.labelTh : tag.labelEn;
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
  if (field === 'reflection') return lang === LANG.TH ? insight.reflectionTh : insight.reflectionEn;
  if (field === 'biologyFact') return lang === LANG.TH ? insight.biologyFactTh : insight.biologyFactEn;
  return lang === LANG.TH ? insight.microActionTh : insight.microActionEn;
};
