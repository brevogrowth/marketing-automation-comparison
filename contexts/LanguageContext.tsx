'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Language, Translations, getTranslations, detectBrowserLanguage, supportedLanguages } from '@/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from URL param, localStorage, or browser detection
  useEffect(() => {
    // Priority 1: URL parameter
    const urlLang = searchParams.get('lang');
    if (urlLang && supportedLanguages.includes(urlLang as Language)) {
      setLanguageState(urlLang as Language);
      localStorage.setItem('preferred-language', urlLang);
      setIsInitialized(true);
      return;
    }

    // Priority 2: localStorage
    const storedLang = localStorage.getItem('preferred-language');
    if (storedLang && supportedLanguages.includes(storedLang as Language)) {
      setLanguageState(storedLang as Language);
      setIsInitialized(true);
      return;
    }

    // Priority 3: Browser language detection
    const browserLang = detectBrowserLanguage();
    setLanguageState(browserLang);
    localStorage.setItem('preferred-language', browserLang);
    setIsInitialized(true);
  }, [searchParams]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);

    // Update URL with lang parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const t = getTranslations(language);

  // Show nothing until language is initialized to prevent flash
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook for just translations
export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
