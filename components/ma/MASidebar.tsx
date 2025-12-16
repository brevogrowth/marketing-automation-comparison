'use client';

import React, { useState } from 'react';
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleUnlock = () => {
    onUnlock();
  };

  const handleAdvancedChange = (newAdvanced: AdvancedFiltersType) => {
    onAdvancedChange(newAdvanced);
  };

  const resetAdvanced = () => {
    onAdvancedChange({ ...DEFAULT_ADVANCED_FILTERS });
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-50 bg-brevo-green text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle filters"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky lg:top-4 inset-y-0 left-0 z-50 lg:z-auto
          w-80 lg:w-full max-w-sm
          bg-white lg:bg-transparent
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
          lg:max-h-[calc(100vh-2rem)]
        `}
      >
        <div className="p-4 lg:p-0 space-y-6">
          {/* Close button (mobile) */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close filters"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Profile Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {ma?.sidebar?.profileTitle || 'Your Profile'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {ma?.sidebar?.profileDescription || 'Tell us about your business'}
            </p>
            <ProfileFilters profile={profile} onChange={onProfileChange} />
          </div>

          {/* Advanced Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {ma?.sidebar?.advancedTitle || 'Advanced Filters'}
              </h2>
              {!isUnlocked && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {ma?.sidebar?.advancedLocked || 'Locked'}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {ma?.sidebar?.advancedDescription || 'Refine your search'}
            </p>

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
                    className="mt-4 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset Advanced Filters
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={handleUnlock}
                data-testid="advanced-filters"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-brevo-green hover:text-brevo-green transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                {ma?.sidebar?.advancedUnlockButton || 'Unlock Advanced Filters'}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
