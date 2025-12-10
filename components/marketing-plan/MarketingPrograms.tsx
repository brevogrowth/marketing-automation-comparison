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
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
          {t.marketingPlan?.noProgramsAvailable || 'No marketing programs available'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
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

      {/* Program rows - Cards on mobile, table rows on desktop */}
      <div className="space-y-3 md:space-y-0 md:divide-y md:divide-gray-100">
        {programsArray.map((program, index) => (
          <div
            key={index}
            className="bg-gray-50 md:bg-transparent rounded-lg md:rounded-none p-3 md:p-0"
          >
            {/* Desktop: Table row */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors">
              {/* Program Name */}
              <div>
                <span className="font-medium text-gray-900">
                  {program.program_name || program.name || `Program ${index + 1}`}
                </span>
              </div>

              {/* Target */}
              <div>
                <span className="text-sm text-gray-600">{program.target || '-'}</span>
              </div>

              {/* Objective */}
              <div>
                <span className="text-sm text-gray-600">{program.objective || '-'}</span>
              </div>

              {/* KPI */}
              <div>
                <span className="text-sm text-gray-600">{program.kpi || '-'}</span>
              </div>
            </div>

            {/* Mobile: Card layout */}
            <div className="md:hidden">
              {/* Program Name - Prominent */}
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                {program.program_name || program.name || `Program ${index + 1}`}
              </h4>

              {/* Details Grid - 2 columns on mobile */}
              <div className="grid grid-cols-2 gap-2">
                {/* Target */}
                <div className="bg-white rounded-md p-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
                    <Target className="h-3 w-3 text-brevo-green flex-shrink-0" />
                    <span className="truncate">{t.marketingPlan?.target || 'Target'}</span>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2">{program.target || '-'}</p>
                </div>

                {/* KPI */}
                <div className="bg-white rounded-md p-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
                    <TrendingUp className="h-3 w-3 text-brevo-green flex-shrink-0" />
                    <span className="truncate">{t.marketingPlan?.kpi || 'KPI'}</span>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2">{program.kpi || '-'}</p>
                </div>
              </div>

              {/* Objective - Full width */}
              {program.objective && (
                <div className="mt-2 bg-white rounded-md p-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
                    <Lightbulb className="h-3 w-3 text-brevo-green flex-shrink-0" />
                    <span>{t.marketingPlan?.objective || 'Objective'}</span>
                  </div>
                  <p className="text-xs text-gray-700">{program.objective}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketingPrograms;
