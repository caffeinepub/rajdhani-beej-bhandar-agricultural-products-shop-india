import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentLanguage, setCurrentLanguage, getTranslation, type SupportedLanguage } from './i18n';

interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(getCurrentLanguage());

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    setLanguageState(lang);
  };

  const t = (key: string) => getTranslation(key, language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
