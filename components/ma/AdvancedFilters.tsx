'use client';

import React from 'react';
import type { AdvancedFilters as AdvancedFiltersType } from '@/src/types/ma';
import { marketingChannels, popularIntegrations } from '@/config/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdvancedFiltersProps {
  filters: AdvancedFiltersType;
  onChange: (filters: AdvancedFiltersType) => void;
}

// Simplified implementation tolerance options with clear labels and icons
const implementationOptions = [
  { value: 'low', label: 'Quick Setup', icon: '⚡', description: 'Days' },
  { value: 'medium', label: 'Standard', icon: '⚙️', description: 'Weeks' },
  { value: 'high', label: 'Full Custom', icon: '🔧', description: 'Months' },
] as const;

const budgetOptions = [
  { value: 'low', label: 'Budget', icon: '💰' },
  { value: 'medium', label: 'Balanced', icon: '⚖️' },
  { value: 'high', label: 'Premium', icon: '💎' },
] as const;

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
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {ma?.sidebar?.channels || 'Marketing Channels'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {marketingChannels.map((channel) => (
            <button
              key={channel.value}
              type="button"
              onClick={() => toggleChannel(channel.value)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                filters.channels.includes(channel.value)
                  ? 'bg-brevo-green text-white border-brevo-green shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brevo-green hover:text-brevo-green'
              }`}
            >
              {channel.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Integrations */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {ma?.sidebar?.integrations || 'Key Integrations'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {popularIntegrations.map((integration) => (
            <button
              key={integration}
              type="button"
              onClick={() => toggleIntegration(integration)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                filters.integrations.includes(integration)
                  ? 'bg-brevo-green text-white border-brevo-green shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brevo-green hover:text-brevo-green'
              }`}
            >
              {integration}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Sensitivity */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {ma?.sidebar?.budgetSensitivity || 'Budget Priority'}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ ...filters, budget_sensitivity: option.value })}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 text-xs rounded-lg border transition-all ${
                filters.budget_sensitivity === option.value
                  ? 'bg-brevo-green text-white border-brevo-green shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brevo-green hover:text-brevo-green'
              }`}
            >
              <span>{option.icon}</span>
              <span className="font-medium">{ma?.budgetLevels?.[option.value] || option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Governance Required */}
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.governance}
            onChange={(e) => onChange({ ...filters, governance: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brevo-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brevo-green"></div>
        </label>
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-700">
            {ma?.sidebar?.governance || 'Enterprise Governance'}
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            {ma?.sidebar?.governanceHelp || 'SSO, RBAC, multi-brand support'}
          </p>
        </div>
      </div>

      {/* Implementation Tolerance */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {ma?.sidebar?.implementationTolerance || 'Setup Time'}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {implementationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ ...filters, implementation_tolerance: option.value })}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 text-xs rounded-lg border transition-all ${
                filters.implementation_tolerance === option.value
                  ? 'bg-brevo-green text-white border-brevo-green shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brevo-green hover:text-brevo-green'
              }`}
            >
              <span>{option.icon}</span>
              <span className="font-medium">{ma?.implementationLevels?.[option.value] || option.label}</span>
              <span className={`text-[10px] ${filters.implementation_tolerance === option.value ? 'text-white/70' : 'text-gray-400'}`}>
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
