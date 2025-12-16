'use client';

import React from 'react';
import type { UserProfile, AdvancedFilters, FilterResult } from '@/src/types/ma';
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

  const { vendors, relaxed } = filterResult;

  // Get relaxation message if applicable
  const relaxationMessage = relaxed ? getRelaxationMessage(filterResult, t) : null;

  if (vendors.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
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
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {ma?.vendors?.noVendorsFound || 'No vendors found'}
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Try adjusting your filters or search query to see more options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Relaxation Banner */}
      {relaxed && relaxationMessage && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50/80 border border-amber-100 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-amber-600"
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
          </div>
          <p className="text-sm text-amber-800">{relaxationMessage}</p>
        </div>
      )}

      {/* Top Picks Section - Only show top 3 when not relaxed */}
      {!relaxed && vendors.length >= 3 && (
        <div className="mb-2">
          <div className="flex items-center gap-2 px-1 mb-3">
            <div className="flex items-center gap-1.5 text-brevo-green">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">{ma?.vendors?.topPicks || 'Top Picks for You'}</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-brevo-green/20 to-transparent"></div>
          </div>
        </div>
      )}

      {/* Vendor Cards */}
      <div className="space-y-3">
        {vendors.map((vendor, index) => (
          <VendorCard
            key={vendor.vendor_id}
            vendor={vendor}
            profile={profile}
            advanced={advanced}
            compareMode={compareMode}
            isInCompare={compareVendors.includes(vendor.vendor_id)}
            onToggleCompare={onToggleCompare}
            rank={!relaxed && index < 3 ? index + 1 : undefined}
          />
        ))}
      </div>

      {/* Bottom hint */}
      {vendors.length > 5 && (
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            Showing all {vendors.length} vendors based on your criteria
          </p>
        </div>
      )}
    </div>
  );
}
