'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PlanHeaderProps {
  companyName: string;
  companyDomain?: string;
  isPersonalized?: boolean;
  onShare?: () => void;
}

export function PlanHeader({
  companyName,
  companyDomain,
  isPersonalized = false,
  onShare
}: PlanHeaderProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  // Display text logic: prioritize company name, fall back to domain
  const displayText = companyName === "Unknown Company" && companyDomain
    ? companyDomain
    : companyName || companyDomain || 'Unknown Company';

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare?.();
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <h1 className="text-base sm:text-lg font-bold text-gray-900">
          {t.marketingPlan?.headerTitle || 'Marketing Relationship Plan'}
        </h1>
        {isPersonalized ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brevo-green text-white">
            {t.marketingPlan?.personalized || 'Personalized'}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {t.marketingPlan?.template || 'Template'}
          </span>
        )}
        {isPersonalized && displayText && (
          <span className="text-gray-500">
            {t.marketingPlan?.forCompany || 'for'}{' '}
            <span className="font-medium text-gray-700">{displayText}</span>
          </span>
        )}
      </div>

      <button
        onClick={handleShare}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brevo-green transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1.5 text-brevo-green" />
            {t.marketingPlan?.copied || 'Copied!'}
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 mr-1.5" />
            {t.marketingPlan?.share || 'Share'}
          </>
        )}
      </button>
    </div>
  );
}

export default PlanHeader;
