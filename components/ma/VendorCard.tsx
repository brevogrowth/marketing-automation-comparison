'use client';

import React, { useState } from 'react';
import type { Vendor, UserProfile, AdvancedFilters, Complexity } from '@/src/types/ma';
import { scoreVendor } from '@/lib/ma/scoring';
import { WhyRecommended } from './WhyRecommended';
import { Overview, Ratings, Features, Feedback, Pricing, Integrations } from './VendorSections';
import { useLanguage } from '@/contexts/LanguageContext';
import { complexityLabels, companySizeLabels } from '@/config/ma';

interface VendorCardProps {
  vendor: Vendor;
  profile: UserProfile;
  advanced?: AdvancedFilters | null;
  compareMode?: boolean;
  isInCompare?: boolean;
  onToggleCompare?: (vendorId: string) => void;
}

type SectionKey = 'overview' | 'ratings' | 'features' | 'feedback' | 'pricing' | 'integrations';

const sectionIcons: Record<SectionKey, React.ReactNode> = {
  overview: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ratings: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  features: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  feedback: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  pricing: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  integrations: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  ),
};

function getComplexityColor(complexity: Complexity): string {
  const colors: Record<Complexity, string> = {
    light: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    heavy: 'bg-red-100 text-red-800',
  };
  return colors[complexity];
}

export function VendorCard({
  vendor,
  profile,
  advanced,
  compareMode = false,
  isInCompare = false,
  onToggleCompare,
}: VendorCardProps) {
  const { t } = useLanguage();
  const ma = t.ma;
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(() => new Set<SectionKey>(['overview']));

  const score = scoreVendor(vendor, profile, advanced);

  const toggleSection = (section: SectionKey) => {
    const newSections = new Set(openSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setOpenSections(newSections);
  };

  const sections: { key: SectionKey; label: string; component: React.ReactNode }[] = [
    { key: 'overview', label: ma?.vendors?.sections?.overview || 'Overview', component: <Overview vendor={vendor} /> },
    { key: 'ratings', label: ma?.vendors?.sections?.ratings || 'Ratings', component: <Ratings vendor={vendor} /> },
    { key: 'features', label: ma?.vendors?.sections?.features || 'Features', component: <Features vendor={vendor} /> },
    { key: 'feedback', label: ma?.vendors?.sections?.feedback || 'Feedback', component: <Feedback vendor={vendor} /> },
    { key: 'pricing', label: ma?.vendors?.sections?.pricing || 'Pricing', component: <Pricing vendor={vendor} /> },
    { key: 'integrations', label: ma?.vendors?.sections?.integrations || 'Integrations', component: <Integrations vendor={vendor} /> },
  ];

  const avgRating = ((vendor.g2.rating + vendor.capterra.rating) / 2).toFixed(1);

  return (
    <div
      data-testid={`vendor-card-${vendor.vendor_id}`}
      className={`bg-white rounded-xl shadow-sm border transition-all ${
        isInCompare ? 'border-brevo-green ring-2 ring-brevo-green/20' : 'border-gray-100 hover:shadow-md'
      }`}
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {vendor.logo_path ? (
              <img
                src={vendor.logo_path}
                alt={`${vendor.name} logo`}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {vendor.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Name & Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
              {vendor.is_brevo && (
                <span className="px-2 py-0.5 text-xs bg-brevo-green text-white rounded-full">
                  Sponsor
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
              {vendor.short_description}
            </p>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Segments */}
              {vendor.target_segments.map((seg) => (
                <span
                  key={seg}
                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                >
                  {ma?.sizes?.[seg] || companySizeLabels[seg]}
                </span>
              ))}
              {/* Complexity */}
              <span
                className={`px-2 py-0.5 text-xs rounded ${getComplexityColor(vendor.complexity)}`}
              >
                {ma?.complexity?.[vendor.complexity] || complexityLabels[vendor.complexity]}
              </span>
            </div>
          </div>

          {/* Score & Compare */}
          <div className="flex flex-col items-end gap-2">
            {/* Fit Score */}
            <div className="text-right">
              <div className="text-2xl font-bold text-brevo-green">{score.score}</div>
              <div className="text-xs text-gray-500">
                {ma?.vendors?.score || 'Fit Score'}
              </div>
            </div>

            {/* Average Rating */}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {avgRating}
            </div>

            {/* Compare Toggle */}
            {compareMode && onToggleCompare && (
              <button
                type="button"
                data-testid="add-compare"
                onClick={() => onToggleCompare(vendor.vendor_id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  isInCompare
                    ? 'bg-brevo-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isInCompare
                  ? ma?.vendors?.removeFromCompare || 'Remove'
                  : ma?.vendors?.addToCompare || 'Compare'}
              </button>
            )}
          </div>
        </div>

        {/* Why Recommended */}
        {score.reasons.length > 0 && (
          <div className="mt-4">
            <WhyRecommended reasons={score.reasons} score={score.score} />
          </div>
        )}
      </div>

      {/* Collapsible Sections */}
      <div className="border-t border-gray-100">
        {sections.map((section) => (
          <div key={section.key} className="border-b border-gray-50 last:border-b-0">
            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                {sectionIcons[section.key]}
                {section.label}
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  openSections.has(section.key) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSections.has(section.key) && (
              <div className="px-5 pb-4">{section.component}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
