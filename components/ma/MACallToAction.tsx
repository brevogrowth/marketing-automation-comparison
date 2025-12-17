'use client';

import React from 'react';
import { Button } from '@brevogrowth/brevo-tools-ui-kit';
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
          >
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-brevo-green hover:bg-gray-100 font-semibold gap-2"
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
            </Button>
          </a>

          {/* Secondary CTA - Book Demo */}
          <a
            href={branding.links.demo}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold"
            >
              {ma?.cta?.bookDemo || 'Book a Demo'}
            </Button>
          </a>
        </div>

        <p className="mt-4 text-sm text-white/70">
          {ma?.cta?.tryBrevoDesc || 'Start your 30-day free trial'}
        </p>
      </div>
    </section>
  );
}
