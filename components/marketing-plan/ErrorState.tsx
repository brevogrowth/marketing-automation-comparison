'use client';

import { useState } from 'react';
import { AlertTriangle, RotateCw, ChevronDown, ChevronUp, Bug, FileCode, Database, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DebugInfo {
  errorMessage?: string;
  resultType?: string;
  dataKeys?: string[];
  resultPreview?: string;
  [key: string]: unknown;
}

interface ErrorStateProps {
  message?: string;
  details?: DebugInfo | string | null;
  onRetry: () => void;
  onTryDifferentDomain?: () => void;
  domainName?: string;
}

export function ErrorState({
  message,
  details,
  onRetry,
  onTryDifferentDomain,
  domainName
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useLanguage();

  // Detect error types for user-friendly messaging
  const isEmptyPlanError =
    message?.includes('empty') ||
    message?.includes('Empty') ||
    message?.includes('no data') ||
    message?.includes('missing');

  const isInvalidDomainError =
    message?.includes('company is required') ||
    message?.includes('non-empty string') ||
    message?.includes('valid company domain');

  const isConnectionError =
    message?.includes('timeout') ||
    message?.includes('network') ||
    message?.includes('connection') ||
    message?.includes('API');

  // Determine user-friendly message
  const getUserFriendlyMessage = (): string => {
    if (message) {
      if (isInvalidDomainError) {
        return domainName
          ? `"${domainName}" ${t.marketingPlan?.errorInvalidDomain || 'appears to be invalid. Please try a different company domain.'}`
          : t.marketingPlan?.errorEnterValidDomain || 'Please enter a valid company domain.';
      }

      if (isEmptyPlanError) {
        return domainName
          ? `${t.marketingPlan?.errorNoDataFor || 'No marketing data available for'} ${domainName}. ${t.marketingPlan?.errorTryDifferent || 'Please try a different domain.'}`
          : t.marketingPlan?.errorNoData || 'No marketing data available. Please try a different domain.';
      }

      if (isConnectionError) {
        return t.marketingPlan?.errorConnection || 'Connection error. Please check your internet connection and try again.';
      }

      return message;
    }

    return t.marketingPlan?.errorUnexpected || 'An unexpected error occurred. Please try again.';
  };

  // Determine which action button to show
  const shouldShowTryDifferentDomain = (isEmptyPlanError || isInvalidDomainError) && onTryDifferentDomain;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t.marketingPlan?.errorTitle || 'Error Occurred'}
        </h2>
        <p className="text-gray-500 text-sm">
          {t.marketingPlan?.errorSubtitle || 'Something went wrong while generating your marketing plan'}
        </p>
      </div>

      {/* Error Message */}
      <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-800 text-center">
          {getUserFriendlyMessage()}
        </p>
      </div>

      {/* Technical Details (collapsible) */}
      {details && (
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 rounded-lg"
          >
            <span className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              {t.marketingPlan?.technicalDetails || 'Technical details'}
            </span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {showDetails && (
            <div className="mt-2 space-y-3">
              {/* String details (legacy) */}
              {typeof details === 'string' && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <pre className="text-xs text-gray-600 overflow-auto max-h-40 whitespace-pre-wrap font-mono">
                    {details}
                  </pre>
                </div>
              )}

              {/* Structured debug info */}
              {typeof details === 'object' && details !== null && (
                <>
                  {/* Error Message */}
                  {details.errorMessage && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-xs font-semibold text-red-700">Error Message</span>
                      </div>
                      <pre className="text-xs text-red-600 overflow-auto whitespace-pre-wrap font-mono">
                        {details.errorMessage}
                      </pre>
                    </div>
                  )}

                  {/* Result Type & Keys */}
                  {(details.resultType || details.dataKeys) && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-semibold text-blue-700">Response Structure</span>
                      </div>
                      <div className="text-xs text-blue-600 space-y-1">
                        {details.resultType && (
                          <p><span className="font-medium">Type:</span> {details.resultType}</p>
                        )}
                        {details.dataKeys && details.dataKeys.length > 0 && (
                          <p><span className="font-medium">Keys:</span> {details.dataKeys.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Raw Response Preview */}
                  {details.resultPreview && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FileCode className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-700">Raw Response Preview</span>
                      </div>
                      <pre className="text-xs text-gray-600 overflow-auto max-h-60 whitespace-pre-wrap font-mono bg-white p-2 rounded border">
                        {details.resultPreview}
                      </pre>
                    </div>
                  )}

                  {/* Any additional keys */}
                  {Object.keys(details).filter(k => !['errorMessage', 'resultType', 'dataKeys', 'resultPreview'].includes(k)).length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Bug className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-700">Additional Info</span>
                      </div>
                      <pre className="text-xs text-gray-600 overflow-auto max-h-40 whitespace-pre-wrap font-mono">
                        {JSON.stringify(
                          Object.fromEntries(
                            Object.entries(details).filter(([k]) => !['errorMessage', 'resultType', 'dataKeys', 'resultPreview'].includes(k))
                          ),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Helpful Tips */}
      {(isEmptyPlanError || isInvalidDomainError) && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-amber-800 mb-2">
            {t.marketingPlan?.errorTipsTitle || 'Tips for better results:'}
          </p>
          <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
            <li>{t.marketingPlan?.errorTip1 || 'Use an established company domain with public presence'}</li>
            <li>{t.marketingPlan?.errorTip2 || 'Avoid generic domains like example.com or test.com'}</li>
            <li>{t.marketingPlan?.errorTip3 || 'Try companies with active marketing presence'}</li>
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {shouldShowTryDifferentDomain ? (
          <>
            <button
              onClick={onTryDifferentDomain}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brevo-green text-white rounded-lg font-medium hover:bg-brevo-dark-green transition-colors"
            >
              <RotateCw className="h-4 w-4" />
              {t.marketingPlan?.tryDifferentDomain || 'Try Different Domain'}
            </button>
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {t.marketingPlan?.tryAgain || 'Try Again'}
            </button>
          </>
        ) : (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brevo-green text-white rounded-lg font-medium hover:bg-brevo-dark-green transition-colors"
          >
            <RotateCw className="h-4 w-4" />
            {t.marketingPlan?.tryAgain || 'Try Again'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
