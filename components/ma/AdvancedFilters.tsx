'use client';

import React from 'react';
import type { AdvancedFilters as AdvancedFiltersType } from '@/src/types/ma';
import { marketingChannels, popularIntegrations, complexityLevels } from '@/config/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdvancedFiltersProps {
  filters: AdvancedFiltersType;
  onChange: (filters: AdvancedFiltersType) => void;
}

export function AdvancedFilters({ filters, onChange }: AdvancedFiltersProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  const toggleChannel = (channel: string) => {
    const channels = filters.channels.includes(channel)
      ? filters.channels.filter((c) => c !== channel)
      : [...filters.channels, channel];
    onChange({ ...filters, channels });
  };

  const toggleIntegration = (integration: string) => {
    const integrations = filters.integrations.includes(integration)
      ? filters.integrations.filter((i) => i !== integration)
      : [...filters.integrations, integration];
    onChange({ ...filters, integrations });
  };

  return (
    <div className="space-y-5">
      {/* Marketing Channels */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {ma?.sidebar?.channels || 'Marketing Channels'}
        </label>
        <div className="flex flex-wrap gap-2">
          {marketingChannels.map((channel) => (
            <button
              key={channel.value}
              type="button"
              onClick={() => toggleChannel(channel.value)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filters.channels.includes(channel.value)
                  ? 'bg-brevo-green text-white border-brevo-green'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brevo-green'
              }`}
            >
              {channel.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {ma?.sidebar?.channelsHelp || 'Which channels do you need?'}
        </p>
      </div>

      {/* Key Integrations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {ma?.sidebar?.integrations || 'Key Integrations'}
        </label>
        <div className="flex flex-wrap gap-2">
          {popularIntegrations.map((integration) => (
            <button
              key={integration}
              type="button"
              onClick={() => toggleIntegration(integration)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filters.integrations.includes(integration)
                  ? 'bg-brevo-green text-white border-brevo-green'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brevo-green'
              }`}
            >
              {integration}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {ma?.sidebar?.integrationsHelp || 'Must-have integrations'}
        </p>
      </div>

      {/* Budget Sensitivity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {ma?.sidebar?.budgetSensitivity || 'Budget Sensitivity'}
        </label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ ...filters, budget_sensitivity: level })}
              className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                filters.budget_sensitivity === level
                  ? 'bg-brevo-green text-white border-brevo-green'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brevo-green'
              }`}
            >
              {ma?.budgetLevels?.[level] || level}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {ma?.sidebar?.budgetSensitivityHelp || 'How important is pricing?'}
        </p>
      </div>

      {/* Governance Required */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.governance}
            onChange={(e) => onChange({ ...filters, governance: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-brevo-green focus:ring-brevo-green"
          />
          <span className="text-sm font-medium text-gray-700">
            {ma?.sidebar?.governance || 'Governance Required'}
          </span>
        </label>
        <p className="mt-1 text-xs text-gray-500 ml-6">
          {ma?.sidebar?.governanceHelp || 'Need SSO, RBAC, multi-brand?'}
        </p>
      </div>

      {/* Implementation Tolerance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {ma?.sidebar?.implementationTolerance || 'Implementation Tolerance'}
        </label>
        <div className="flex gap-2">
          {complexityLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  implementation_tolerance: level.value === 'light'
                    ? 'low'
                    : level.value === 'medium'
                    ? 'medium'
                    : 'high',
                })
              }
              className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                (filters.implementation_tolerance === 'low' && level.value === 'light') ||
                (filters.implementation_tolerance === 'medium' && level.value === 'medium') ||
                (filters.implementation_tolerance === 'high' && level.value === 'heavy')
                  ? 'bg-brevo-green text-white border-brevo-green'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brevo-green'
              }`}
            >
              {ma?.implementationLevels?.[
                level.value === 'light' ? 'low' : level.value === 'medium' ? 'medium' : 'high'
              ] || level.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {ma?.sidebar?.implementationToleranceHelp || 'How much setup complexity is acceptable?'}
        </p>
      </div>
    </div>
  );
}
