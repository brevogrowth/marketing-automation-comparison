'use client';

import React from 'react';
import type { Vendor } from '@/src/types/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface IntegrationsProps {
  vendor: Vendor;
}

export function Integrations({ vendor }: IntegrationsProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  if (!vendor.integrations || vendor.integrations.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No integration information available.
      </p>
    );
  }

  // Group integrations by category (simple heuristic)
  const categorize = (integration: string): string => {
    const lower = integration.toLowerCase();
    if (['shopify', 'woocommerce', 'magento', 'bigcommerce', 'prestashop'].some((e) => lower.includes(e))) {
      return 'E-commerce';
    }
    if (['salesforce', 'hubspot', 'pipedrive', 'zoho'].some((c) => lower.includes(c))) {
      return 'CRM';
    }
    if (['segment', 'snowflake', 'bigquery', 'google analytics', 'mixpanel'].some((d) => lower.includes(d))) {
      return 'Data & Analytics';
    }
    if (['zapier', 'make', 'integromat', 'n8n', 'pabbly'].some((a) => lower.includes(a))) {
      return 'Automation';
    }
    if (['slack', 'teams', 'notion', 'asana', 'monday'].some((p) => lower.includes(p))) {
      return 'Productivity';
    }
    return 'Other';
  };

  const grouped: Record<string, string[]> = {};
  for (const integration of vendor.integrations) {
    const category = categorize(integration);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(integration);
  }

  // Sort categories by count
  const sortedCategories = Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length)
    .filter(([cat]) => cat !== 'Other');

  const otherCategory = grouped['Other'];
  if (otherCategory) {
    sortedCategories.push(['Other', otherCategory]);
  }

  return (
    <div className="space-y-4">
      {sortedCategories.map(([category, integrations]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
          <div className="flex flex-wrap gap-2">
            {integrations.map((integration) => (
              <span
                key={integration}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                {integration}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Total count */}
      <p className="text-xs text-gray-400 text-right">
        {vendor.integrations.length} integrations available
      </p>
    </div>
  );
}
