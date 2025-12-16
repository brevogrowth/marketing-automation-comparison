'use client';

import React from 'react';
import { branding } from '@/config/branding';
import { useLanguage } from '@/contexts/LanguageContext';

export function MACallToAction() {
  const { t } = useLanguage();
  const ma = t.ma;

  return (
    <section className="mt-12 bg-gradient-to-br from-brevo-green to-brevo-green/80 rounded-2xl p-8 md:p-12 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {ma?.cta?.title || 'Ready to get started?'}
        </h2>
        <p className="text-lg text-white/90 mb-8">
          {ma?.cta?.subtitle ||
            'Brevo offers all the features you need at a competitive price.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Primary CTA - Try Free */}
          <a
            href={branding.links.trial}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brevo-green font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {ma?.cta?.tryBrevo || 'Try Brevo Free'}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          {/* Secondary CTA - Book Demo */}
          <a
            href={branding.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            {ma?.cta?.bookDemo || 'Book a Demo'}
          </a>
        </div>

        <p className="mt-4 text-sm text-white/70">
          {ma?.cta?.tryBrevoDesc || 'Start your 30-day free trial'}
        </p>
      </div>
    </section>
  );
}
