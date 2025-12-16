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
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Selected vendors */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {ma?.compare?.title || 'Comparing'}:
            </span>
            <div className="flex items-center gap-2">
              {vendors.map((vendor) => (
                <div
                  key={vendor.vendor_id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {vendor.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(vendor.vendor_id)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`Remove ${vendor.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: MAX_COMPARE_VENDORS - vendors.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-24 h-9 border-2 border-dashed border-gray-200 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Status message */}
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {vendors.length} {ma?.compare?.selected || 'selected'}
              {isMaxed && ` (${ma?.compare?.maxReached || 'max reached'})`}
              {!canCompare && ` - ${ma?.compare?.minRequired || 'select at least 2'}`}
            </span>

            {/* Clear button */}
            <button
              type="button"
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {ma?.toolbar?.clearCompare || 'Clear'}
            </button>

            {/* Compare button */}
            <button
              type="button"
              onClick={onCompare}
              disabled={!canCompare}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                canCompare
                  ? 'bg-brevo-green text-white hover:bg-brevo-green/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {ma?.compare?.viewComparison || 'Compare'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
