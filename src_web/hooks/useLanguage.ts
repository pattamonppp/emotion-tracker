import { useState, useEffect, useCallback } from 'react';
import { Language, LocaleTranslations, getTranslation } from '../locales';

const STORAGE_KEY = 'mooca_language_pref';

export const useLanguage = (initialLang: Language = 'th') => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'th' || saved === 'en') {
        return saved;
      }
    } catch {
      // LocalStorage access fallback
    }
    return initialLang;
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'th' ? 'en' : 'th');
  }, [lang, setLang]);

  const t: LocaleTranslations = getTranslation(lang);

  return {
    lang,
    setLang,
    toggleLang,
    t,
  };
};

export default useLanguage;
