'use client';

import React from 'react';
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

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...profile, company_size: e.target.value as CompanySize });
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...profile, industry: e.target.value });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...profile, primary_goal: e.target.value });
  };

  return (
    <div className="space-y-4">
      {/* Company Size */}
      <div>
        <label
          htmlFor="company-size"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {ma?.sidebar?.companySize || 'Company Size'}
        </label>
        <select
          id="company-size"
          data-testid="company-size"
          value={profile.company_size}
          onChange={handleSizeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brevo-green focus:border-brevo-green bg-white text-gray-900"
        >
          {companySizes.map((size) => (
            <option key={size.value} value={size.value}>
              {ma?.sizes?.[size.value] || size.label} ({size.description})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {ma?.sidebar?.companySizeHelp || 'Your organization\'s size'}
        </p>
      </div>

      {/* Industry */}
      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {ma?.sidebar?.industry || 'Industry'}
        </label>
        <select
          id="industry"
          data-testid="industry"
          value={profile.industry}
          onChange={handleIndustryChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brevo-green focus:border-brevo-green bg-white text-gray-900"
        >
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {ma?.sidebar?.industryHelp || 'Your primary business sector'}
        </p>
      </div>

      {/* Primary Goal */}
      <div>
        <label
          htmlFor="primary-goal"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {ma?.sidebar?.primaryGoal || 'Primary Goal'}
        </label>
        <select
          id="primary-goal"
          data-testid="primary-goal"
          value={profile.primary_goal}
          onChange={handleGoalChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brevo-green focus:border-brevo-green bg-white text-gray-900"
        >
          {primaryGoals.map((goal) => (
            <option key={goal.value} value={goal.value}>
              {ma?.goals?.[goal.value] || goal.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {ma?.sidebar?.primaryGoalHelp || 'What do you want to achieve?'}
        </p>
      </div>
    </div>
  );
}
