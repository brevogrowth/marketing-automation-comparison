'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Rocket,
  MessageCircle,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { BrevoHelpScenario } from '@/src/types/marketing-plan';

interface BrevoHelpProps {
  scenarios: BrevoHelpScenario[];
}

export function BrevoHelp({ scenarios }: BrevoHelpProps) {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const { t } = useLanguage();

  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  const toggleScenario = (scenarioName: string) => {
    setExpandedScenario(prev =>
      prev === scenarioName ? null : scenarioName
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          {t.marketingPlan?.howBrevoHelps || 'How Brevo Could Help You'}
        </h2>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => {
          const isExpanded = expandedScenario === scenario.scenario_name;

          return (
            <div
              key={index}
              className={`border rounded-lg transition-all ${isExpanded
                ? 'border-brevo-green shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              {/* Collapsible Header */}
              <button
                className="w-full flex justify-between items-center p-4 text-left"
                onClick={() => toggleScenario(scenario.scenario_name)}
                aria-expanded={isExpanded}
              >
                <span className="font-medium text-gray-900">{scenario.scenario_name}</span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Why Brevo is Better */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Rocket className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {t.marketingPlan?.whyBrevoBetter || 'Why Brevo is Better'}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">{scenario.why_brevo_is_better}</p>
                    </div>

                    {/* Omnichannel Strategy */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">
                          {t.marketingPlan?.omnichannelStrategy || 'Omnichannel Strategy'}
                        </span>
                      </div>
                      <p className="text-sm text-purple-800">{scenario.omnichannel_channels}</p>
                    </div>

                    {/* Setup Efficiency */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">
                          {t.marketingPlan?.setupEfficiency || 'Setup Efficiency'}
                        </span>
                      </div>
                      <p className="text-sm text-green-800">{scenario.setup_efficiency}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BrevoHelp;
