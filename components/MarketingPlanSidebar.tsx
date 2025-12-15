'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import { Building2, Sparkles, Lock, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
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
  onGeneratePersonalizedPlan: () => void;

  // State
  isLoading: boolean;
  isUnlocked: boolean; // Whether user has provided email (for personalized plans)

  // Validation
  domainError?: string;

  // Mobile behavior
  hasPlan?: boolean; // Whether a plan is currently displayed
}

const MarketingPlanSidebarComponent = ({
  industry,
  setIndustry,
  domain,
  setDomain,
  onGeneratePersonalizedPlan,
  isLoading,
  isUnlocked,
  domainError,
  hasPlan = false
}: MarketingPlanSidebarProps) => {
  const { t } = useLanguage();

  // Mobile collapsed state - collapsed by default when plan is shown
  const [isMobileExpanded, setIsMobileExpanded] = useState(!hasPlan);

  // Update collapsed state when hasPlan changes
  useEffect(() => {
    if (hasPlan) {
      setIsMobileExpanded(false);
    }
  }, [hasPlan]);

  const handleIndustryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.target.value as Industry);
  }, [setIndustry]);

  const handleDomainChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  }, [setDomain]);

  const toggleMobileExpand = useCallback(() => {
    setIsMobileExpanded(prev => !prev);
  }, []);

  // Get display label for current selection
  const getSelectionSummary = () => {
    if (domain.trim()) {
      return domain.trim();
    }
    return t.industries?.[industry] || industry;
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
      {/* Mobile Header - Collapsible Toggle */}
      <button
        onClick={toggleMobileExpand}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Settings2 className="h-5 w-5 text-brevo-green" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {t.sidebar?.configureTitle || 'Configuration'}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[200px]">
              {getSelectionSummary()}
            </p>
          </div>
        </div>
        {isMobileExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Content - Collapsible on mobile, always visible on desktop */}
      <div className={`p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 ${
        isMobileExpanded ? 'block' : 'hidden lg:flex'
      }`}>
        {/* Section 1: Industry Plan */}
        <div className="flex flex-col">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-brevo-green rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">1</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              {t.sidebar?.industryPlanTitle || 'Plan by Type'}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 ml-9 sm:ml-10">
            {t.sidebar?.industryPlanDesc || 'Get a ready-to-use marketing plan based on best practices for your industry. No signup required.'}
          </p>

          {/* Industry Selector */}
          <div>
            <select
              value={industry}
              onChange={handleIndustryChange}
              disabled={isLoading}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brevo-green focus:ring-brevo-green text-sm py-3 pl-4 pr-10 border disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2224%22%20height%3d%2224%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%236b7280%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')] bg-no-repeat bg-[length:20px_20px] bg-[right_12px_center]"
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
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-brevo-green rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">2</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              {t.sidebar?.customPlanTitle || 'Custom Plan'}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 ml-9 sm:ml-10">
            {t.sidebar?.customPlanDesc || 'Our AI analyzes your company and creates a fully personalized plan with specific recommendations for your brand.'}
          </p>

          {/* Domain Input */}
          <div className="mb-3 sm:mb-4">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={domain}
                onChange={handleDomainChange}
                placeholder={t.sidebar?.domainPlaceholder || 'yourcompany.com'}
                disabled={isLoading}
                className={`w-full pl-10 rounded-lg shadow-sm text-base sm:text-sm p-3 border disabled:opacity-50 disabled:cursor-not-allowed ${
                  domainError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-brevo-green focus:ring-brevo-green'
                }`}
                style={{ fontSize: '16px' }} // Prevent iOS zoom
              />
            </div>
            {domainError && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">{domainError}</p>
            )}
          </div>

          {/* CTA Button - Touch-friendly min height 44px */}
          <button
            onClick={onGeneratePersonalizedPlan}
            disabled={isLoading || !domain.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-3 px-4 bg-brevo-green text-white rounded-lg font-medium hover:bg-brevo-dark-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg min-h-[44px]"
          >
            {!isUnlocked && <Lock className="h-4 w-4" />}
            <Sparkles className="h-4 w-4" />
            <span className="text-sm sm:text-base">
              {isLoading
                ? (t.marketingPlan?.generating || 'Generating...')
                : (t.marketingPlan?.generatePersonalized || 'Generate Personalized Plan')
              }
            </span>
          </button>

          {!isUnlocked && (
            <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              {t.marketingPlan?.emailRequired || 'Business email required'}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            {t.marketingPlan?.poweredBy || 'Powered by Brevo AI'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const MarketingPlanSidebar = memo(MarketingPlanSidebarComponent);
export default MarketingPlanSidebar;
