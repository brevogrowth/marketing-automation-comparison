import en from './en.json';
import fr from './fr.json';
import de from './de.json';
import es from './es.json';
import type { LeadCaptureTranslations } from '../types';

const translations: Record<string, LeadCaptureTranslations> = {
  en,
  fr,
  de,
  es,
};

function detectLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language.split('-')[0].toLowerCase();
  return translations[browserLang] ? browserLang : 'en';
}

export function getTranslations(
  language?: string,
  overrides?: Partial<LeadCaptureTranslations>
): LeadCaptureTranslations {
  const lang = language || detectLanguage();
  const base = translations[lang] || translations.en;

  return {
    ...base,
    ...overrides,
  };
}

export { translations };
