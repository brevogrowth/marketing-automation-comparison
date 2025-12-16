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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brevo-green focus:border-brevo-green"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
            {ma?.toolbar?.sortBy || 'Sort by'}:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brevo-green focus:border-brevo-green bg-white text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {ma?.toolbar?.[option.value] || option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Compare Toggle */}
        <button
          type="button"
          data-testid="compare-toggle"
          onClick={() => onCompareModeChange(!compareMode)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            compareMode
              ? 'bg-brevo-green text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          {ma?.toolbar?.compareMode || 'Compare'}
          {compareMode && compareCount > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {compareCount}
            </span>
          )}
        </button>
      </div>

      {/* Results count */}
      <div className="mt-3 text-sm text-gray-500">
        Showing {totalCount} vendor{totalCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
