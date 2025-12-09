'use client';

import React, { useState } from 'react';
import { Loader2, X, ChevronDown, ChevronUp, Bug } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface DebugInfo {
  conversationId: string | null;
  pollCount: number;
  lastPollStatus: string | null;
  lastPollMessage: string | null;
  logs: string[];
}

interface LoadingBannerProps {
  companyDomain: string;
  progress: number;
  elapsedTime?: number;
  onCancel: () => void;
  debugInfo?: DebugInfo;
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
  debugInfo,
}) => {
  const { t } = useLanguage();
  const [showDebug, setShowDebug] = useState(false);

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

        {/* Right: Debug toggle + Cancel button */}
        <div className="flex items-center gap-2">
          {debugInfo && (
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Debug logs"
            >
              <Bug className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onCancel}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title={t.marketingPlan?.cancel || 'Cancel'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && debugInfo && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg text-xs font-mono text-gray-300 overflow-auto max-h-64">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 font-semibold">Debug Logs</span>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-gray-300"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <div><span className="text-blue-400">conversationId:</span> {debugInfo.conversationId || 'N/A'}</div>
            <div><span className="text-blue-400">pollCount:</span> {debugInfo.pollCount}</div>
            <div><span className="text-blue-400">lastPollStatus:</span> {debugInfo.lastPollStatus || 'N/A'}</div>
            <div><span className="text-blue-400">lastPollMessage:</span> {debugInfo.lastPollMessage || 'N/A'}</div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <span className="text-yellow-400">Poll logs:</span>
              <div className="mt-1 max-h-32 overflow-y-auto">
                {debugInfo.logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet...</div>
                ) : (
                  debugInfo.logs.map((log, i) => (
                    <div key={i} className="text-gray-400">{log}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingBanner;
