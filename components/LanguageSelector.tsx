'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language, languageNames, supportedLanguages } from '@/i18n';

// SVG Flag components for consistent rendering across all platforms
const FlagEN = () => (
  <svg className="w-5 h-5 rounded-sm" viewBox="0 0 60 30">
    <clipPath id="en-clip"><rect width="60" height="30"/></clipPath>
    <g clipPath="url(#en-clip)">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#en-clip)"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const FlagFR = () => (
  <svg className="w-5 h-5 rounded-sm" viewBox="0 0 30 20">
    <rect width="10" height="20" fill="#002395"/>
    <rect x="10" width="10" height="20" fill="#fff"/>
    <rect x="20" width="10" height="20" fill="#ED2939"/>
  </svg>
);

const FlagDE = () => (
  <svg className="w-5 h-5 rounded-sm" viewBox="0 0 30 18">
    <rect width="30" height="6" fill="#000"/>
    <rect y="6" width="30" height="6" fill="#DD0000"/>
    <rect y="12" width="30" height="6" fill="#FFCE00"/>
  </svg>
);

const FlagES = () => (
  <svg className="w-5 h-5 rounded-sm" viewBox="0 0 30 20">
    <rect width="30" height="20" fill="#AA151B"/>
    <rect y="5" width="30" height="10" fill="#F1BF00"/>
  </svg>
);

const flagComponents: Record<Language, React.FC> = {
  en: FlagEN,
  fr: FlagFR,
  de: FlagDE,
  es: FlagES,
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const CurrentFlag = flagComponents[language];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={languageNames[language]}
      >
        <CurrentFlag />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {supportedLanguages.map((lang) => {
            const FlagComponent = flagComponents[lang];
            return (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  language === lang ? 'bg-brevo-green/10 text-brevo-dark-green font-medium' : 'text-gray-700'
                }`}
              >
                <FlagComponent />
                <span>{languageNames[lang]}</span>
                {language === lang && (
                  <svg className="w-4 h-4 ml-auto text-brevo-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
