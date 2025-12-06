'use client';

import React, { useState, useCallback, memo } from 'react';
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
  const [activeTab, setActiveTab] = useState<'static' | 'personalized'>('static');

  const handleIndustryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.target.value as Industry);
  }, [setIndustry]);

  const handleDomainChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  }, [setDomain]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          {t.marketingPlan?.sidebarTitle || 'Marketing Plan Generator'}
        </h2>
        <p className="text-sm text-gray-500">
          {t.marketingPlan?.sidebarDesc || 'Generate a customized marketing relationship plan for your business'}
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('static')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeTab === 'static'
              ? 'bg-white text-brevo-green shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          {t.marketingPlan?.tabStatic || 'Template'}
        </button>
        <button
          onClick={() => setActiveTab('personalized')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeTab === 'personalized'
              ? 'bg-white text-brevo-green shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {t.marketingPlan?.tabPersonalized || 'AI Personalized'}
        </button>
      </div>

      {/* Industry Selector (common to both) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.sidebar?.industryLabel || 'Industry'}
        </label>
        <select
          value={industry}
          onChange={handleIndustryChange}
          disabled={isLoading}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-brevo-green focus:ring-brevo-green sm:text-sm p-2.5 border disabled:opacity-50 disabled:cursor-not-allowed"
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

      <hr className="border-gray-100 mb-6" />

      {/* Static Plan Tab Content */}
      {activeTab === 'static' && (
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <div className="bg-brevo-light/50 rounded-lg p-4 border border-brevo-green/10">
              <h3 className="text-sm font-medium text-brevo-dark-green mb-2">
                {t.marketingPlan?.staticPlanTitle || 'Industry Template Plan'}
              </h3>
              <p className="text-xs text-brevo-dark-green/80">
                {t.marketingPlan?.staticPlanDesc || 'Get a ready-to-use marketing plan template based on industry best practices. No email required.'}
              </p>
            </div>
          </div>

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

          <p className="text-xs text-gray-400 text-center mt-3">
            {t.marketingPlan?.noEmailRequired || 'No email required'}
          </p>
        </div>
      )}

      {/* Personalized Plan Tab Content */}
      {activeTab === 'personalized' && (
        <div className="flex-1 flex flex-col">
          {/* Domain Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brevo-green" />
                {t.marketingPlan?.companyDomain || 'Company Domain'}
              </span>
            </label>
            <input
              type="text"
              value={domain}
              onChange={handleDomainChange}
              placeholder="yourcompany.com"
              disabled={isLoading}
              className={`w-full rounded-md shadow-sm sm:text-sm p-2.5 border disabled:opacity-50 disabled:cursor-not-allowed ${
                domainError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-brevo-green focus:ring-brevo-green'
              }`}
            />
            {domainError && (
              <p className="mt-1 text-sm text-red-500">{domainError}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-purple-900 mb-1">
                    {t.marketingPlan?.aiPoweredTitle || 'AI-Powered Analysis'}
                  </h3>
                  <p className="text-xs text-purple-700">
                    {t.marketingPlan?.aiPoweredDesc || 'Our AI analyzes your company and creates a fully personalized marketing plan tailored to your business.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={onGeneratePersonalizedPlan}
            disabled={isLoading || !domain.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-brevo-green to-emerald-500 text-white rounded-lg font-medium hover:from-brevo-dark-green hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {!isUnlocked && <Lock className="h-4 w-4" />}
            <Rocket className="h-4 w-4" />
            {isLoading
              ? (t.marketingPlan?.generating || 'Generating...')
              : (t.marketingPlan?.generatePersonalized || 'Generate Personalized Plan')
            }
          </button>

          {!isUnlocked && (
            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              {t.marketingPlan?.emailRequired || 'Business email required'}
            </p>
          )}
        </div>
      )}

      {/* Bottom Info */}
      <div className="mt-auto pt-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {t.marketingPlan?.poweredBy || 'Powered by Brevo AI'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const MarketingPlanSidebar = memo(MarketingPlanSidebarComponent);
export default MarketingPlanSidebar;
