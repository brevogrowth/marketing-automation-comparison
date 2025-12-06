'use client';

import React, { useCallback, memo } from 'react';
import { Building2, Rocket, Sparkles, Lock, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Industry } from '@/config/industries';

interface MarketingPlanSidebarProps {
  // Industry selection
  industry: Industry;
  setIndustry: (industry: Industry) => void;

  // Domain input for personalized plans
  domain: string;
  setDomain: (domain: string) => void;

  // Actions
  onGenerateStaticPlan: () => void;
  onGeneratePersonalizedPlan: () => void;

  // State
  isLoading: boolean;
  isUnlocked: boolean; // Whether user has provided email (for personalized plans)

  // Validation
  domainError?: string;
}

const MarketingPlanSidebarComponent = ({
  industry,
  setIndustry,
  domain,
  setDomain,
  onGenerateStaticPlan,
  onGeneratePersonalizedPlan,
  isLoading,
  isUnlocked,
  domainError
}: MarketingPlanSidebarProps) => {
  const { t } = useLanguage();

  const handleIndustryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.target.value as Industry);
  }, [setIndustry]);

  const handleDomainChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  }, [setDomain]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col gap-6">
      {/* Section 1: Industry Plan */}
      <div className="flex flex-col">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 bg-brevo-green rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">1</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {t.sidebar?.industryPlanTitle || 'Plan by Type'}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 ml-10">
          {t.sidebar?.industryPlanDesc || 'Get a ready-to-use marketing plan based on best practices for your industry. No signup required.'}
        </p>

        {/* Industry Selector */}
        <div className="mb-4">
          <select
            value={industry}
            onChange={handleIndustryChange}
            disabled={isLoading}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brevo-green focus:ring-brevo-green sm:text-sm p-3 border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <optgroup label={t.industries?.b2cRetail || 'B2C Retail'}>
              <option value="Fashion">{t.industries?.Fashion || 'Fashion & Apparel'}</option>
              <option value="Beauty">{t.industries?.Beauty || 'Beauty & Cosmetics'}</option>
              <option value="Home">{t.industries?.Home || 'Home & Garden'}</option>
              <option value="Electronics">{t.industries?.Electronics || 'Electronics'}</option>
              <option value="Food">{t.industries?.Food || 'Food & Beverage'}</option>
              <option value="Sports">{t.industries?.Sports || 'Sports & Outdoors'}</option>
              <option value="Luxury">{t.industries?.Luxury || 'Luxury Goods'}</option>
              <option value="Family">{t.industries?.Family || 'Family & Kids'}</option>
            </optgroup>
            <optgroup label={t.industries?.b2b || 'B2B'}>
              <option value="SaaS">{t.industries?.SaaS || 'SaaS & Software'}</option>
              <option value="Services">{t.industries?.Services || 'Professional Services'}</option>
              <option value="Manufacturing">{t.industries?.Manufacturing || 'Manufacturing'}</option>
              <option value="Wholesale">{t.industries?.Wholesale || 'Wholesale & Distribution'}</option>
            </optgroup>
          </select>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGenerateStaticPlan}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brevo-green text-white rounded-lg font-medium hover:bg-brevo-dark-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          <FileText className="h-4 w-4" />
          {isLoading
            ? (t.marketingPlan?.generating || 'Generating...')
            : (t.marketingPlan?.viewTemplatePlan || 'View Template Plan')
          }
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <hr className="border-gray-200" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400 uppercase tracking-wide">
          {t.sidebar?.orDivider || 'or'}
        </span>
      </div>

      {/* Section 2: Custom Plan */}
      <div className="flex flex-col">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 bg-brevo-green rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">2</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {t.sidebar?.customPlanTitle || 'Custom Plan'}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 ml-10">
          {t.sidebar?.customPlanDesc || 'Our AI analyzes your company and creates a fully personalized plan with specific recommendations for your brand.'}
        </p>

        {/* Domain Input */}
        <div className="mb-4">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={domain}
              onChange={handleDomainChange}
              placeholder={t.sidebar?.domainPlaceholder || 'yourcompany.com'}
              disabled={isLoading}
              className={`w-full pl-10 rounded-lg shadow-sm sm:text-sm p-3 border disabled:opacity-50 disabled:cursor-not-allowed ${
                domainError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-brevo-green focus:ring-brevo-green'
              }`}
            />
          </div>
          {domainError && (
            <p className="mt-1 text-sm text-red-500">{domainError}</p>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onGeneratePersonalizedPlan}
          disabled={isLoading || !domain.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brevo-green text-white rounded-lg font-medium hover:bg-brevo-dark-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {!isUnlocked && <Lock className="h-4 w-4" />}
          <Sparkles className="h-4 w-4" />
          {isLoading
            ? (t.marketingPlan?.generating || 'Generating...')
            : (t.marketingPlan?.generatePersonalized || 'Generate Personalized Plan')
          }
        </button>

        {!isUnlocked && (
          <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            {t.marketingPlan?.emailRequired || 'Business email required'}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          {t.marketingPlan?.poweredBy || 'Powered by Brevo AI'}
        </p>
      </div>
    </div>
  );
};

export const MarketingPlanSidebar = memo(MarketingPlanSidebarComponent);
export default MarketingPlanSidebar;
