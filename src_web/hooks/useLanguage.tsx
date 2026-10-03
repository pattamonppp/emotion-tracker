import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Language, LocaleTranslations, getTranslation } from '../locales';
import { LANG } from '../types';

const STORAGE_KEY = 'mooca_language_pref';

export interface LanguageContextValue {
  lang: Language;
  setLang: (newLang: Language) => void;
  toggleLang: () => void;
  t: LocaleTranslations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLang?: Language;
}> = ({ children, initialLang = LANG.TH }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === LANG.TH || saved === LANG.EN) {
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
    setLang(lang === LANG.TH ? LANG.EN : LANG.TH);
  }, [lang, setLang]);

  const t: LocaleTranslations = useMemo(() => getTranslation(lang), [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
    }),
    [lang, setLang, toggleLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (fallbackLang: Language = LANG.TH): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (context) {
    return context;
  }

  // Graceful standalone fallback if used outside LanguageProvider
  const t = getTranslation(fallbackLang);
  return {
    lang: fallbackLang,
    setLang: () => {},
    toggleLang: () => {},
    t,
  };
};

export default useLanguage;
