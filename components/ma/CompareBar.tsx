'use client';

import React from 'react';
import type { Vendor } from '@/src/types/ma';
import { MIN_COMPARE_VENDORS, MAX_COMPARE_VENDORS } from '@/src/types/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompareBarProps {
  vendors: Vendor[];
  onRemove: (vendorId: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export function CompareBar({ vendors, onRemove, onClear, onCompare }: CompareBarProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  const canCompare = vendors.length >= MIN_COMPARE_VENDORS;
  const isMaxed = vendors.length >= MAX_COMPARE_VENDORS;

  return (
    <div
      data-testid="compare-bar"
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-brevo-green/30 to-transparent" />

      <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl shadow-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Selected vendors */}
            <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                <svg className="w-4 h-4 text-brevo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">{ma?.compare?.title || 'Comparing'}</span>
              </div>

              <div className="flex items-center gap-2">
                {vendors.map((vendor) => (
                  <div
                    key={vendor.vendor_id}
                    className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-brevo-green/10 border border-brevo-green/20 rounded-full transition-colors hover:bg-brevo-green/15"
                  >
                    <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      {vendor.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(vendor.vendor_id)}
                      className="p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label={`Remove ${vendor.name}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: MAX_COMPARE_VENDORS - vendors.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center justify-center w-20 h-8 border border-dashed border-gray-300 rounded-full"
                  >
                    <span className="text-xs text-gray-400">+</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Status badge */}
              <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                canCompare
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {canCompare ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ready
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Select {MIN_COMPARE_VENDORS - vendors.length} more
                  </>
                )}
              </span>

              {/* Clear button */}
              <button
                type="button"
                onClick={onClear}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={ma?.toolbar?.clearCompare || 'Clear selection'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              {/* Compare button */}
              <button
                type="button"
                onClick={onCompare}
                disabled={!canCompare}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                  canCompare
                    ? 'bg-brevo-green text-white hover:bg-brevo-green/90 shadow-sm shadow-brevo-green/20'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">{ma?.compare?.viewComparison || 'Compare Now'}</span>
                <span className="sm:hidden">Go</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
