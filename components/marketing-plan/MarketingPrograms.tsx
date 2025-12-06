'use client';

import { Target, Lightbulb, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MarketingProgram } from '@/src/types/marketing-plan';

interface MarketingProgramsProps {
  programs: MarketingProgram[] | Record<string, MarketingProgram>;
}

export function MarketingPrograms({ programs }: MarketingProgramsProps) {
  const { t } = useLanguage();

  // Convert programs to array if it's an object
  const programsArray = Array.isArray(programs)
    ? programs
    : Object.values(programs || {});

  if (programsArray.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="text-center py-8 text-gray-500">
          {t.marketingPlan?.noProgramsAvailable || 'No marketing programs available'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      {/* Desktop table header */}
      <div className="hidden md:grid md:grid-cols-4 gap-4 px-4 py-3 bg-gray-50 rounded-lg mb-2 text-sm font-medium text-gray-600">
        <div>{t.marketingPlan?.programName || 'Program Name'}</div>
        <div className="flex items-center gap-1">
          <Target className="h-4 w-4 text-brevo-green" />
          {t.marketingPlan?.target || 'Target'}
        </div>
        <div className="flex items-center gap-1">
          <Lightbulb className="h-4 w-4 text-brevo-green" />
          {t.marketingPlan?.objective || 'Objective'}
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-brevo-green" />
          {t.marketingPlan?.kpi || 'KPI'}
        </div>
      </div>

      {/* Program rows */}
      <div className="divide-y divide-gray-100">
        {programsArray.map((program, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            {/* Program Name */}
            <div>
              <div className="md:hidden text-xs font-medium text-gray-500 mb-1">
                {t.marketingPlan?.programName || 'Program Name'}
              </div>
              <span className="font-medium text-gray-900">
                {program.program_name || program.name || `Program ${index + 1}`}
              </span>
            </div>

            {/* Target */}
            <div>
              <div className="md:hidden text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                <Target className="h-3 w-3 text-brevo-green" />
                {t.marketingPlan?.target || 'Target'}
              </div>
              <span className="text-sm text-gray-600">{program.target || '-'}</span>
            </div>

            {/* Objective */}
            <div>
              <div className="md:hidden text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                <Lightbulb className="h-3 w-3 text-brevo-green" />
                {t.marketingPlan?.objective || 'Objective'}
              </div>
              <span className="text-sm text-gray-600">{program.objective || '-'}</span>
            </div>

            {/* KPI */}
            <div>
              <div className="md:hidden text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-brevo-green" />
                {t.marketingPlan?.kpi || 'KPI'}
              </div>
              <span className="text-sm text-gray-600">{program.kpi || '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketingPrograms;
