'use client';

import React, { useState } from 'react';
import type { Vendor, UserProfile, AdvancedFilters, Complexity } from '@/src/types/ma';
import { scoreVendor } from '@/lib/ma/scoring';
import { useLanguage } from '@/contexts/LanguageContext';
import { complexityLabels, companySizeLabels } from '@/config/ma';

interface VendorCardProps {
  vendor: Vendor;
  profile: UserProfile;
  advanced?: AdvancedFilters | null;
  compareMode?: boolean;
  isInCompare?: boolean;
  onToggleCompare?: (vendorId: string) => void;
  rank?: number; // 1, 2, or 3 for top picks
}

type TabKey = 'overview' | 'ratings' | 'features' | 'feedback';

function getComplexityColor(complexity: Complexity): string {
  const colors: Record<Complexity, string> = {
    light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    heavy: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return colors[complexity];
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${iconSize} ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function VendorCard({
  vendor,
  profile,
  advanced,
  compareMode = false,
  isInCompare = false,
  onToggleCompare,
  rank,
}: VendorCardProps) {
  const { t } = useLanguage();
  const ma = t.ma;
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const score = scoreVendor(vendor, profile, advanced);
  const avgRating = ((vendor.g2.rating + vendor.capterra.rating) / 2).toFixed(1);
  const totalReviews = vendor.g2.reviews_count + vendor.capterra.reviews_count;

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: ma?.vendors?.sections?.overview || 'Overview' },
    { key: 'ratings', label: ma?.vendors?.sections?.ratings || 'Ratings' },
    { key: 'features', label: ma?.vendors?.sections?.features || 'Features' },
    { key: 'feedback', label: ma?.vendors?.sections?.feedback || 'Pros & Cons' },
  ];

  return (
    <div
      data-testid={`vendor-card-${vendor.vendor_id}`}
      className={`bg-white rounded-xl border transition-all duration-200 ${
        isInCompare
          ? 'border-brevo-green ring-2 ring-brevo-green/20 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {/* Compact Header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Rank Badge (Top 3) */}
          {rank && rank <= 3 && (
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                rank === 1
                  ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900'
                  : rank === 2
                  ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700'
                  : 'bg-gradient-to-br from-orange-300 to-orange-400 text-orange-800'
              }`}
              title={`#${rank} pick for your profile`}
            >
              {rank}
            </div>
          )}

          {/* Compare Checkbox (when in compare mode) */}
          {compareMode && onToggleCompare && (
            <button
              type="button"
              data-testid="add-compare"
              onClick={() => onToggleCompare(vendor.vendor_id)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isInCompare
                  ? 'bg-brevo-green border-brevo-green text-white'
                  : 'border-gray-300 hover:border-brevo-green'
              }`}
            >
              {isInCompare && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )}

          {/* Logo */}
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
            {vendor.logo_path ? (
              <img
                src={vendor.logo_path}
                alt={`${vendor.name} logo`}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-sm font-semibold text-gray-400">${vendor.name.charAt(0)}</span>`;
                }}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-400">
                {vendor.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Name & Rating */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{vendor.name}</h3>
              {vendor.is_brevo && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-brevo-green/10 text-brevo-green rounded">
                  Sponsor
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={Number(avgRating)} />
              <span className="text-xs text-gray-500">
                {avgRating} ({totalReviews.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            {vendor.target_segments.slice(0, 2).map((seg) => (
              <span
                key={seg}
                className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded border border-blue-100"
              >
                {ma?.sizes?.[seg] || companySizeLabels[seg]}
              </span>
            ))}
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getComplexityColor(vendor.complexity)}`}>
              {ma?.complexity?.[vendor.complexity] || complexityLabels[vendor.complexity]}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <div className={`text-xl font-bold ${score.score >= 70 ? 'text-brevo-green' : score.score >= 50 ? 'text-amber-500' : 'text-gray-400'}`}>
                {score.score}
              </div>
              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                Fit
              </div>
            </div>

            {/* Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-lg transition-colors ${
                isExpanded
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Why Recommended - Quick preview */}
        {score.reasons.length > 0 && !isExpanded && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-brevo-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{score.reasons[0]}</span>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 px-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-brevo-green'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brevo-green" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'overview' && (
              <OverviewContent vendor={vendor} score={score} ma={ma} />
            )}
            {activeTab === 'ratings' && (
              <RatingsContent vendor={vendor} ma={ma} />
            )}
            {activeTab === 'features' && (
              <FeaturesContent vendor={vendor} ma={ma} />
            )}
            {activeTab === 'feedback' && (
              <FeedbackContent vendor={vendor} ma={ma} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline tab content components for better performance
function OverviewContent({ vendor, score, ma }: { vendor: Vendor; score: ReturnType<typeof scoreVendor>; ma: any }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 leading-relaxed">
        {vendor.short_description}
      </p>

      {/* Why Recommended */}
      {score.reasons.length > 0 && (
        <div className="bg-brevo-green/5 rounded-lg p-3">
          <div className="text-xs font-medium text-brevo-green mb-2">Why this fits your profile</div>
          <ul className="space-y-1">
            {score.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-brevo-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths & Considerations */}
      <div className="grid grid-cols-2 gap-4">
        {vendor.strength_tags.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Strengths</div>
            <div className="flex flex-wrap gap-1.5">
              {vendor.strength_tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {vendor.weakness_tags.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Consider</div>
            <div className="flex flex-wrap gap-1.5">
              {vendor.weakness_tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-amber-50 text-amber-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visit Website */}
      <a
        href={vendor.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brevo-green hover:underline"
      >
        Visit website
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

function RatingsContent({ vendor, ma }: { vendor: Vendor; ma: any }) {
  const sources = [
    { name: 'G2', data: vendor.g2, color: 'bg-orange-500' },
    { name: 'Capterra', data: vendor.capterra, color: 'bg-blue-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {sources.map((source) => (
        <div key={source.name} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${source.color}`} />
            <span className="text-sm font-medium text-gray-700">{source.name}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{source.data.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">/5</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {source.data.reviews_count.toLocaleString()} reviews
          </div>
          {source.data.url && (
            <a
              href={source.data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-brevo-green hover:underline"
            >
              View reviews →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function FeaturesContent({ vendor, ma }: { vendor: Vendor; ma: any }) {
  if (vendor.features.length === 0) {
    return <p className="text-sm text-gray-500">No detailed feature information available.</p>;
  }

  // Group by category and take top 3 categories
  const grouped = new Map<string, typeof vendor.features>();
  for (const f of vendor.features) {
    const existing = grouped.get(f.category) || [];
    existing.push(f);
    grouped.set(f.category, existing);
  }

  const levelColors = {
    full: 'bg-emerald-100 text-emerald-700',
    partial: 'bg-blue-100 text-blue-700',
    limited: 'bg-amber-100 text-amber-700',
    none: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="space-y-4">
      {Array.from(grouped.entries()).slice(0, 3).map(([category, features]) => (
        <div key={category}>
          <div className="text-xs font-medium text-gray-500 mb-2">{category}</div>
          <div className="space-y-1">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-700">{f.feature}</span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${levelColors[f.level]}`}>
                  {f.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedbackContent({ vendor, ma }: { vendor: Vendor; ma: any }) {
  const pros = vendor.feedback.filter((f) => f.type === 'pro').slice(0, 3);
  const cons = vendor.feedback.filter((f) => f.type === 'con').slice(0, 3);

  if (pros.length === 0 && cons.length === 0) {
    return <p className="text-sm text-gray-500">No user feedback available.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Pros
        </div>
        <ul className="space-y-1.5">
          {pros.map((p, i) => (
            <li key={i} className="text-sm text-gray-600">
              • {p.theme}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
          Cons
        </div>
        <ul className="space-y-1.5">
          {cons.map((c, i) => (
            <li key={i} className="text-sm text-gray-600">
              • {c.theme}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
