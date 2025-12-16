'use client';

import React from 'react';
import type { Vendor, UserProfile, AdvancedFilters, FilterResult } from '@/src/types/ma';
import { VendorCard } from './VendorCard';
import { getRelaxationMessage } from '@/lib/ma/filters';
import { useLanguage } from '@/contexts/LanguageContext';

interface VendorListProps {
  filterResult: FilterResult;
  profile: UserProfile;
  advanced?: AdvancedFilters | null;
  compareMode: boolean;
  compareVendors: string[];
  onToggleCompare: (vendorId: string) => void;
}

export function VendorList({
  filterResult,
  profile,
  advanced,
  compareMode,
  compareVendors,
  onToggleCompare,
}: VendorListProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  const { vendors, relaxed, relaxationLevel } = filterResult;

  // Get relaxation message if applicable
  const relaxationMessage = relaxed ? getRelaxationMessage(filterResult, t) : null;

  if (vendors.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {ma?.vendors?.noVendorsFound || 'No vendors found'}
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters to see more options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Relaxation Banner */}
      {relaxed && relaxationMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-amber-800">{relaxationMessage}</p>
        </div>
      )}

      {/* Vendor Cards */}
      <div className="space-y-4">
        {vendors.map((vendor, index) => (
          <div key={vendor.vendor_id} data-testid="vendor-card">
            {/* Recommended badge for top 3 */}
            {index < 3 && !relaxed && (
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-brevo-green/10 text-brevo-green text-xs font-medium rounded-full">
                  #{index + 1} {ma?.vendors?.recommended || 'Recommended'}
                </span>
              </div>
            )}
            <VendorCard
              vendor={vendor}
              profile={profile}
              advanced={advanced}
              compareMode={compareMode}
              isInCompare={compareVendors.includes(vendor.vendor_id)}
              onToggleCompare={onToggleCompare}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
