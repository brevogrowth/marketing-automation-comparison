'use client';

import React from 'react';
import type { Vendor, PricingModel, PriceBucket } from '@/src/types/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface PricingProps {
  vendor: Vendor;
}

export function Pricing({ vendor }: PricingProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  const getPricingModelLabel = (model: PricingModel): string => {
    const labels: Record<PricingModel, string> = {
      contacts: ma?.vendors?.pricing?.contacts || 'Per contacts',
      events: ma?.vendors?.pricing?.events || 'Per events',
      seats: ma?.vendors?.pricing?.seats || 'Per seats',
      messages: ma?.vendors?.pricing?.messages || 'Per messages',
      hybrid: ma?.vendors?.pricing?.hybrid || 'Hybrid pricing',
      custom: ma?.vendors?.pricing?.custom || 'Custom pricing',
    };
    return labels[model] || model;
  };

  const getPriceBucketLabel = (bucket: PriceBucket): string => {
    const labels: Record<PriceBucket, string> = {
      low: ma?.vendors?.pricing?.low || 'Budget-friendly',
      medium: ma?.vendors?.pricing?.medium || 'Mid-range',
      high: ma?.vendors?.pricing?.high || 'Premium',
      enterprise: ma?.vendors?.pricing?.enterprise || 'Enterprise',
      unknown: ma?.vendors?.pricing?.unknown || 'Contact for pricing',
    };
    return labels[bucket] || bucket;
  };

  const getPriceBucketColor = (bucket: PriceBucket): string => {
    const colors: Record<PriceBucket, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-gray-800 text-white',
      unknown: 'bg-gray-100 text-gray-600',
    };
    return colors[bucket] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Pricing Model */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {ma?.vendors?.pricing?.model || 'Pricing Model'}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {getPricingModelLabel(vendor.pricing_model)}
          </p>
        </div>

        {/* Price Bucket */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {ma?.vendors?.pricing?.startingAt || 'Starting at'}
          </p>
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getPriceBucketColor(
              vendor.starting_price_bucket
            )}`}
          >
            {getPriceBucketLabel(vendor.starting_price_bucket)}
          </span>
        </div>
      </div>

      {/* Pricing Notes */}
      {vendor.pricing_notes && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
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
            <p className="text-sm text-blue-800">{vendor.pricing_notes}</p>
          </div>
        </div>
      )}

      {/* CTA to vendor site */}
      <a
        href={vendor.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-brevo-green hover:underline"
      >
        View full pricing on {vendor.name}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}
