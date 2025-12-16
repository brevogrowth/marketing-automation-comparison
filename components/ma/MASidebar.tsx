'use client';

import React from 'react';
import type { UserProfile, AdvancedFilters as AdvancedFiltersType } from '@/src/types/ma';
import { DEFAULT_ADVANCED_FILTERS } from '@/src/types/ma';
import { ProfileFilters } from './ProfileFilters';
import { AdvancedFilters } from './AdvancedFilters';
import { useLanguage } from '@/contexts/LanguageContext';

interface MASidebarProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  advanced: AdvancedFiltersType | null;
  onAdvancedChange: (advanced: AdvancedFiltersType | null) => void;
  isUnlocked: boolean;
  onUnlock: () => void;
}

export function MASidebar({
  profile,
  onProfileChange,
  advanced,
  onAdvancedChange,
  isUnlocked,
  onUnlock,
}: MASidebarProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  const handleAdvancedChange = (newAdvanced: AdvancedFiltersType) => {
    onAdvancedChange(newAdvanced);
  };

  const resetAdvanced = () => {
    onAdvancedChange({ ...DEFAULT_ADVANCED_FILTERS });
  };

  return (
    <div className="sticky top-4 space-y-4">
      {/* Profile Filters Section */}
      <div className="relative">
        {/* Gradient glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-brevo-green/20 via-transparent to-brevo-green/10 rounded-2xl blur-sm" />

        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100/80 overflow-hidden">
          {/* Header with gradient accent */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brevo-green/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-brevo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {ma?.sidebar?.profileTitle || 'Your Profile'}
                </h2>
                <p className="text-xs text-gray-500">
                  {ma?.sidebar?.profileDescription || 'Tell us about your business'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <ProfileFilters profile={profile} onChange={onProfileChange} />
          </div>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="relative">
        {/* Conditional glow based on unlock state */}
        {isUnlocked && (
          <div className="absolute -inset-0.5 bg-gradient-to-br from-brevo-green/15 via-transparent to-brevo-green/5 rounded-2xl blur-sm" />
        )}

        <div className={`relative bg-white rounded-xl shadow-sm border overflow-hidden ${
          isUnlocked ? 'border-gray-100/80' : 'border-gray-200 border-dashed'
        }`}>
          {/* Header */}
          <div className={`px-5 py-4 border-b ${isUnlocked ? 'bg-gradient-to-r from-gray-50 to-white border-gray-100' : 'bg-gray-50/50 border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isUnlocked ? 'bg-brevo-green/10' : 'bg-gray-100'
                }`}>
                  <svg
                    className={`w-4 h-4 ${isUnlocked ? 'text-brevo-green' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isUnlocked ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    )}
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {ma?.sidebar?.advancedTitle || 'Advanced Filters'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isUnlocked
                      ? (ma?.sidebar?.advancedDescription || 'Refine your search')
                      : (ma?.sidebar?.advancedLocked || 'Unlock with business email')
                    }
                  </p>
                </div>
              </div>
              {!isUnlocked && (
                <span className="px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded-full">
                  PRO
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {isUnlocked ? (
              <>
                <AdvancedFilters
                  filters={advanced || DEFAULT_ADVANCED_FILTERS}
                  onChange={handleAdvancedChange}
                />
                {advanced && (
                  <button
                    type="button"
                    onClick={resetAdvanced}
                    className="mt-5 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Filters
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={onUnlock}
                data-testid="advanced-filters"
                className="group w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-xl hover:border-brevo-green hover:from-brevo-green/5 hover:to-white transition-all duration-200"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-brevo-green/10 flex items-center justify-center mb-3 transition-colors">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-brevo-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-brevo-green transition-colors">
                    {ma?.sidebar?.advancedUnlockButton || 'Unlock Advanced Filters'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Filter by channels, integrations & more
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick tip */}
      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-blue-900 font-medium">
              {ma?.sidebar?.tip?.title || 'Pro tip'}
            </p>
            <p className="text-xs text-blue-700 mt-0.5">
              {ma?.sidebar?.tip?.content || 'Click on any vendor card to see detailed features, ratings, and user feedback.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for sidebar
export function MASidebarLoadingState() {
  return (
    <div className="sticky top-4 space-y-4">
      {/* Profile skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Advanced skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed overflow-hidden">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-36 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="w-full h-24 bg-gray-50 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
