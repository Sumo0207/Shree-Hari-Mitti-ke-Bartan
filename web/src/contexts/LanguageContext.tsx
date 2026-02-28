import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import enTranslations from '@/locales/en.json';
import hiTranslations from '@/locales/hi.json';
import guTranslations from '@/locales/gu.json';

export type Language = 'en' | 'hi' | 'gu';

export const languages = [
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLocalizedContent: (item: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window === 'undefined') return 'gu';
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'gu';
    } catch {
      return 'gu';
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
      }
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translationModules: Record<Language, any> = {
      en: enTranslations,
      hi: hiTranslations,
      gu: guTranslations,
    };

    const translations = translationModules[language] || translationModules.en;
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  /**
   * Helper to get localized content from a database object.
   * Priority: Selected Language -> Empty String (Strict)
   * Note: Fallback to base field ONLY if it's likely a non-localizable field (logo, etc)
   */
  const getLocalizedContent = useCallback((item: any, field: string): string => {
    if (!item) return '';

    // Check for language specific field (e.g., name_en, name_hi, name_gu)
    const langField = `${field}_${language}`;
    if (item[langField]) return item[langField];

    // If any localized variants exist, we assume this is a localizable field
    // and we should NOT fallback if the current language is missing.
    const hasAnyLocalization = item[`${field}_en`] || item[`${field}_hi`] || item[`${field}_gu`];
    if (hasAnyLocalization) return '';

    // Fallback only for base fields which don't have localization variants (like 'phone', 'email')
    // but were passed through this function for consistency.
    return item[field] || '';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    const t = (key: string): string => {
      const keys = key.split('.');
      let value: any = guTranslations as any;
      for (const k of keys) value = value?.[k];
      return value || key;
    };
    return {
      language: 'gu' as Language,
      setLanguage: (_lang: Language) => { },
      t,
      getLocalizedContent: (item: any, field: string) => item?.[field] || '',
    };
  }
  return context;
};
