'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { branding } from '@/config/branding';

export const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-[#0B996E] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <a href={branding.links.website} target="_blank" rel="noopener noreferrer">
              <Image
                src={branding.logo.white}
                alt={branding.name}
                width={100}
                height={28}
                priority
              />
            </a>
            <span className="hidden sm:block text-white/50">|</span>
            <span className="hidden sm:block text-sm font-medium text-white">{t.header.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <a
              href={branding.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#0B996E] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              {t.header.cta}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
