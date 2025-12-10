'use client';

import { Building2, Target, Users, Briefcase, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CompanySummary as CompanySummaryType } from '@/src/types/marketing-plan';

interface CompanySummaryProps {
  summary: CompanySummaryType;
  showTitle?: boolean;
}

// Helper to check if a string has meaningful content
const hasContent = (value?: string): boolean => {
  if (!value) return false;
  if (value === 'Not specified') return false;
  return value.trim().length > 0;
};

export function CompanySummary({ summary, showTitle = true }: CompanySummaryProps) {
  const { t } = useLanguage();

  // Ensure we have a summary object even if null was passed
  const safeSummary = summary || {};

  // Get display values with fallbacks
  const industryContent = safeSummary.activities || safeSummary.industry || 'Not specified';
  const targetAudienceContent = safeSummary.target || safeSummary.target_audience || 'Not specified';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      {showTitle && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-brevo-light rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-brevo-green" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {t.marketingPlan?.companySummary || 'Company Summary'}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Industry/Activities */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-brevo-green" />
            <span className="text-sm font-medium text-gray-600">
              {t.marketingPlan?.industry || 'Industry'}
            </span>
          </div>
          <p className="text-sm text-gray-900">{industryContent}</p>
        </div>

        {/* Target Audience */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-brevo-green" />
            <span className="text-sm font-medium text-gray-600">
              {t.marketingPlan?.targetAudience || 'Target Audience'}
            </span>
          </div>
          <p className="text-sm text-gray-900">{targetAudienceContent}</p>
        </div>

        {/* Employees (if available) */}
        {hasContent(safeSummary.nb_employees) && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-brevo-green" />
              <span className="text-sm font-medium text-gray-600">
                {t.marketingPlan?.employees || 'Employees'}
              </span>
            </div>
            <p className="text-sm text-gray-900">{safeSummary.nb_employees}</p>
          </div>
        )}

        {/* Business Model (if available) */}
        {hasContent(safeSummary.business_model) && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-brevo-green" />
              <span className="text-sm font-medium text-gray-600">
                {t.marketingPlan?.businessModel || 'Business Model'}
              </span>
            </div>
            <p className="text-sm text-gray-900">{safeSummary.business_model}</p>
          </div>
        )}
      </div>

      {/* Customer Lifecycle (if available, spans full width) */}
      {hasContent(safeSummary.customer_lifecycle_key_steps) && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-brevo-green" />
            <span className="text-sm font-medium text-gray-600">
              {t.marketingPlan?.customerLifecycle || 'Customer Lifecycle'}
            </span>
          </div>
          <p className="text-sm text-gray-900">{safeSummary.customer_lifecycle_key_steps}</p>
        </div>
      )}
    </div>
  );
}

export default CompanySummary;
