'use client';

import React from 'react';
import type { Vendor } from '@/src/types/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface OverviewProps {
  vendor: Vendor;
}

export function Overview({ vendor }: OverviewProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  return (
    <div className="space-y-3">
      <p className="text-gray-700 leading-relaxed">
        {vendor.long_description || vendor.short_description}
      </p>

      {/* Strength Tags */}
      {vendor.strength_tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Strengths</h4>
          <div className="flex flex-wrap gap-2">
            {vendor.strength_tags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weakness Tags */}
      {vendor.weakness_tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Considerations</h4>
          <div className="flex flex-wrap gap-2">
            {vendor.weakness_tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Supported Goals */}
      {vendor.supported_goals && vendor.supported_goals.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Best for</h4>
          <div className="flex flex-wrap gap-2">
            {vendor.supported_goals.map((goal) => (
              <span
                key={goal}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
              >
                {(ma?.goals as Record<string, string> | undefined)?.[goal] || goal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visit Website Link */}
      <a
        href={vendor.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-brevo-green hover:underline mt-2"
      >
        {ma?.vendors?.visitWebsite || 'Visit website'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
