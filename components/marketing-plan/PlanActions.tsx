'use client';

import { useState } from 'react';
import { Share2, Check, Link2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExportPdfButton } from './ExportPdfButton';
import type { MarketingPlan } from '@/src/types/marketing-plan';

interface PlanActionsProps {
  plan: MarketingPlan;
  companyName: string;
  isPersonalized?: boolean;
}

export function PlanActions({
  plan,
  companyName,
  isPersonalized = false
}: PlanActionsProps) {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowSharePopup(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* Export PDF Button */}
      <ExportPdfButton
        plan={plan}
        companyName={companyName}
        isPersonalized={isPersonalized}
      />

      {/* Share Button */}
      <button
        onClick={() => setShowSharePopup(true)}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brevo-green transition-colors"
      >
        <Share2 className="h-4 w-4 mr-1.5" />
        {t.marketingPlan?.share || 'Share'}
      </button>

      {/* Share Popup */}
      {showSharePopup && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowSharePopup(false)}
          />

          {/* Popup */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                {t.marketingPlan?.shareTitle || 'Share this plan'}
              </h3>
              <button
                onClick={() => setShowSharePopup(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-4">
              {t.marketingPlan?.shareDesc || 'Copy the link to share this marketing plan with your team.'}
            </p>

            {/* URL Preview */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
              <Link2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate flex-1">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </span>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyUrl}
              disabled={copied}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                copied
                  ? 'bg-brevo-green text-white'
                  : 'bg-brevo-green text-white hover:bg-brevo-green/90'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  {t.marketingPlan?.copied || 'Copied!'}
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  {t.marketingPlan?.copyLink || 'Copy link'}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PlanActions;
