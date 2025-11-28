import en from './en.json';
import fr from './fr.json';
import de from './de.json';
import es from './es.json';

export type Language = 'en' | 'fr' | 'de' | 'es';

export const translations = {
  en,
  fr,
  de,
  es,
} as const;

export type Translations = typeof en;

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
};

export const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
};

export const supportedLanguages: Language[] = ['en', 'fr', 'de', 'es'];

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  const browserLang = navigator.language.split('-')[0].toLowerCase();

  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }

  return 'en';
}
