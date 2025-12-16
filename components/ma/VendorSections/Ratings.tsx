'use client';

import React from 'react';
import type { Vendor, ReviewSource } from '@/src/types/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface RatingsProps {
  vendor: Vendor;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {/* Half star */}
      {hasHalfStar && (
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#half-grad)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function RatingCard({
  source,
  data,
  viewText,
}: {
  source: 'G2' | 'Capterra';
  data: ReviewSource;
  viewText: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-sm font-bold text-gray-700">{source}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              {data.rating.toFixed(1)}
            </span>
            <StarRating rating={data.rating} />
          </div>
          <p className="text-xs text-gray-500">
            {data.reviews_count.toLocaleString()} reviews
          </p>
        </div>
      </div>
      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-brevo-green hover:underline"
      >
        {viewText}
      </a>
    </div>
  );
}

export function Ratings({ vendor }: RatingsProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-3">
      <RatingCard
        source="G2"
        data={vendor.g2}
        viewText={ma?.vendors?.ratings?.viewOnG2 || 'View on G2'}
      />
      <RatingCard
        source="Capterra"
        data={vendor.capterra}
        viewText={ma?.vendors?.ratings?.viewOnCapterra || 'View on Capterra'}
      />
      <p className="text-xs text-gray-400 text-right">
        {ma?.vendors?.ratings?.lastChecked || 'Last verified'}: {formatDate(vendor.g2.last_checked)}
      </p>
    </div>
  );
}
