'use client';

import React from 'react';
import type { Vendor, VendorFeature, FeatureLevel } from '@/src/types/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeaturesProps {
  vendor: Vendor;
}

function FeatureLevelBadge({ level }: { level: FeatureLevel }) {
  const { t } = useLanguage();
  const ma = t.ma;

  const configs: Record<FeatureLevel, { bg: string; text: string; label: string }> = {
    full: { bg: 'bg-green-100', text: 'text-green-800', label: ma?.vendors?.features?.full || 'Full' },
    partial: { bg: 'bg-blue-100', text: 'text-blue-800', label: ma?.vendors?.features?.partial || 'Partial' },
    limited: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: ma?.vendors?.features?.limited || 'Limited' },
    none: { bg: 'bg-gray-100', text: 'text-gray-600', label: ma?.vendors?.features?.none || 'None' },
  };

  const config = configs[level] || configs.none;

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

function groupFeaturesByCategory(features: VendorFeature[]): Map<string, VendorFeature[]> {
  const grouped = new Map<string, VendorFeature[]>();
  for (const feature of features) {
    const existing = grouped.get(feature.category) || [];
    existing.push(feature);
    grouped.set(feature.category, existing);
  }
  return grouped;
}

export function Features({ vendor }: FeaturesProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  if (vendor.features.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No detailed feature information available.
      </p>
    );
  }

  const groupedFeatures = groupFeaturesByCategory(vendor.features);

  return (
    <div className="space-y-4">
      {Array.from(groupedFeatures.entries()).map(([category, features]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
          <div className="space-y-1">
            {features.map((feature, idx) => (
              <div
                key={`${feature.feature}-${idx}`}
                className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <span className="text-sm text-gray-700">{feature.feature}</span>
                  {feature.notes && (
                    <p className="text-xs text-gray-500 mt-0.5">{feature.notes}</p>
                  )}
                </div>
                <FeatureLevelBadge level={feature.level} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
