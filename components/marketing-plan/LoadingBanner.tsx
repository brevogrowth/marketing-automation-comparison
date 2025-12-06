'use client';

import React from 'react';
import { Loader2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadingBannerProps {
  companyDomain: string;
  progress: number;
  elapsedTime?: number;
  onCancel: () => void;
}

/**
 * Non-blocking loading banner that appears below the H1.
 * Allows users to continue browsing while AI plan generates in background.
 */
export const LoadingBanner: React.FC<LoadingBannerProps> = ({
  companyDomain,
  progress,
  elapsedTime = 0,
  onCancel,
}) => {
  const { t } = useLanguage();

  // Format elapsed time
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-brevo-green/10 to-blue-50 border border-brevo-green/20 rounded-xl p-4 mb-6 animate-pulse-slow">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Loading info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 bg-brevo-green rounded-full flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {t.marketingPlan?.generatingPlanFor || 'Generating plan for'}{' '}
                <span className="text-brevo-green">{companyDomain}</span>
              </h3>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {t.marketingPlan?.loadingBannerHint || 'You can continue browsing while we analyze your company...'}
            </p>
          </div>
        </div>

        {/* Center: Progress */}
        <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brevo-green rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {progress < 100
              ? `${Math.round(progress)}% • ${formatTime(elapsedTime)}`
              : t.marketingPlan?.almostReady || 'Almost ready...'}
          </span>
        </div>

        {/* Right: Cancel button */}
        <button
          onClick={onCancel}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title={t.marketingPlan?.cancel || 'Cancel'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LoadingBanner;
