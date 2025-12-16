'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WhyRecommendedProps {
  reasons: string[];
  score?: number;
}

export function WhyRecommended({ reasons, score }: WhyRecommendedProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  if (reasons.length === 0) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <svg
          className="w-4 h-4 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-medium text-green-800">
          {ma?.vendors?.whyRecommended || 'Why this fits'}
        </span>
        {score !== undefined && (
          <span className="ml-auto text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            {score}% match
          </span>
        )}
      </div>
      <ul className="space-y-1">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
            <span className="text-green-500 mt-1">•</span>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
