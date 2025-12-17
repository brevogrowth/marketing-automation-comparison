'use client';

import React from 'react';
import { Select } from '@brevogrowth/brevo-tools-ui-kit';
import type { UserProfile, CompanySize } from '@/src/types/ma';
import { companySizes, industries, primaryGoals } from '@/config/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileFiltersProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
}

export function ProfileFilters({ profile, onChange }: ProfileFiltersProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  const sizeOptions = companySizes.map((size) => ({
    value: size.value,
    label: `${ma?.sizes?.[size.value] || size.label} (${size.description})`,
  }));

  const industryOptions = industries.map((industry) => ({
    value: industry,
    label: industry,
  }));

  const goalOptions = primaryGoals.map((goal) => ({
    value: goal.value,
    label: ma?.goals?.[goal.value] || goal.label,
  }));

  return (
    <div className="space-y-4">
      {/* Company Size */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {ma?.sidebar?.companySize || 'Company Size'}
        </label>
        <Select
          options={sizeOptions}
          value={profile.company_size}
          onChange={(value) => onChange({ ...profile, company_size: value as CompanySize })}
          data-testid="company-size"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {ma?.sidebar?.industry || 'Industry'}
        </label>
        <Select
          options={industryOptions}
          value={profile.industry}
          onChange={(value) => onChange({ ...profile, industry: value })}
          data-testid="industry"
        />
      </div>

      {/* Primary Goal */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {ma?.sidebar?.primaryGoal || 'Primary Goal'}
        </label>
        <Select
          options={goalOptions}
          value={profile.primary_goal}
          onChange={(value) => onChange({ ...profile, primary_goal: value })}
          data-testid="primary-goal"
        />
      </div>
    </div>
  );
}
