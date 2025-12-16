'use client';

import React from 'react';
import type { SortOption } from '@/src/types/ma';
import { sortOptions } from '@/config/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompareToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  compareMode: boolean;
  onCompareModeChange: (mode: boolean) => void;
  compareCount: number;
  totalCount: number;
}

export function CompareToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  compareMode,
  onCompareModeChange,
  compareCount,
  totalCount,
}: CompareToolbarProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  return (
    <div className="relative mb-6">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50/50 to-white rounded-xl" />

      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/80 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={ma?.toolbar?.search || 'Search vendors...'}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brevo-green/20 focus:border-brevo-green bg-white hover:border-gray-300 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="pl-8 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brevo-green/20 focus:border-brevo-green bg-white text-sm text-gray-700 appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {ma?.toolbar?.[option.value] || option.label}
                  </option>
                ))}
              </select>
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Compare Toggle */}
          <button
            type="button"
            data-testid="compare-toggle"
            onClick={() => onCompareModeChange(!compareMode)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              compareMode
                ? 'bg-brevo-green text-white shadow-sm shadow-brevo-green/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="hidden sm:inline">{ma?.toolbar?.compareMode || 'Compare'}</span>
            {compareMode && compareCount > 0 && (
              <span className="min-w-[20px] h-5 flex items-center justify-center bg-white/25 px-1.5 rounded-full text-xs font-semibold">
                {compareCount}
              </span>
            )}
          </button>
        </div>

        {/* Results count - more subtle */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-brevo-green rounded-full"></span>
              {totalCount} vendor{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
          {compareMode && (
            <span className="text-xs text-brevo-green font-medium">
              Click cards to select for comparison
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
