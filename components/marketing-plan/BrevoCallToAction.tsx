'use client';

import { ArrowRight, TrendingUp, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BrevoCallToActionProps {
  variant?: 'sticky' | 'inline';
}

export function BrevoCallToAction({ variant = 'sticky' }: BrevoCallToActionProps) {
  const { t, language } = useLanguage();

  // Generate UTM-tagged URL based on language
  const getCtaUrl = () => {
    const baseUrl = 'https://www.brevo.com/enterprise/contact-us/';
    const utmParams = new URLSearchParams({
      utm_medium: 'tool',
      utm_source: 'marketing-plan-generator',
      utm_campaign: 'ALL-ENT-tool-marketing-plan-generator',
    });
    return `${baseUrl}?${utmParams.toString()}`;
  };

  if (variant === 'inline') {
    return (
      <div className="bg-gradient-to-r from-brevo-green to-emerald-500 rounded-xl p-6 text-white mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Target className="h-5 w-5" />
              <h2 className="text-lg font-bold">
                {t.marketingPlan?.ctaTitle || 'Ready to turn this plan into results?'}
              </h2>
            </div>
            <p className="text-emerald-50 text-sm">
              {t.marketingPlan?.ctaDescription || 'Your marketing plan is just the beginning. See how Brevo\'s omnichannel CRM can help you execute every strategy.'}
            </p>
          </div>

          <a
            href={getCtaUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brevo-green rounded-lg font-medium hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl"
          >
            <TrendingUp className="h-4 w-4" />
            {t.marketingPlan?.ctaButton || 'Get Expert Guidance'}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  // Sticky footer variant
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-brevo-green to-emerald-500 shadow-2xl border-t-2 border-emerald-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left side - Message */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Target className="h-4 w-4 text-white" />
              <h2 className="text-base font-bold text-white">
                {t.marketingPlan?.ctaTitle || 'Ready to turn this plan into results?'}
              </h2>
            </div>
            <p className="text-emerald-50 text-xs mt-0.5 hidden sm:block">
              {t.marketingPlan?.ctaDescription || 'See how Brevo\'s CRM can help you execute every strategy and track ROI.'}
            </p>
          </div>

          {/* Right side - CTA */}
          <div className="flex flex-col items-center gap-1">
            <a
              href={getCtaUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brevo-green rounded-lg text-sm font-medium hover:bg-emerald-50 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <TrendingUp className="h-4 w-4" />
              {t.marketingPlan?.ctaButton || 'Get Expert Guidance'}
              <ArrowRight className="h-4 w-4" />
            </a>
            <span className="text-emerald-100 text-xs">
              {t.marketingPlan?.ctaSubtext || 'Free consultation'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrevoCallToAction;
