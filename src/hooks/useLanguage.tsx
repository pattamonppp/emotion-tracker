import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { safeStorage as AsyncStorage } from '../services/safeStorage';
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
  const [lang, setLangState] = useState<Language>(initialLang);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === LANG.TH || saved === LANG.EN) {
        setLangState(saved);
      }
    });
  }, []);

  const setLang = useCallback(async (newLang: Language) => {
    setLangState(newLang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLang);
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

  const t = getTranslation(fallbackLang);
  return {
    lang: fallbackLang,
    setLang: () => {},
    toggleLang: () => {},
    t,
  };
};

export default useLanguage;
