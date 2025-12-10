'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Target,
  Lightbulb,
  MessageCircle,
  Mail
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MarketingProgram, ProgramScenario, ScenarioMessage } from '@/src/types/marketing-plan';

interface ProgramDetailsProps {
  program: MarketingProgram;
  programNumber: number;
}

export function ProgramDetails({ program, programNumber }: ProgramDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openScenarios, setOpenScenarios] = useState<Record<number, boolean>>({});
  const { t } = useLanguage();

  const toggleScenario = (index: number) => {
    setOpenScenarios(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Get program name
  const programName = program.program_name || program.name || `Program ${programNumber}`;

  // Get scenarios array
  const scenarios: ProgramScenario[] = program.scenarios || [];

  // Get message sequence as array
  const getMessageSequence = (scenario: ProgramScenario): ScenarioMessage[] => {
    const sequence = scenario.message_sequence;
    if (!sequence) return [];

    if (Array.isArray(sequence)) {
      return sequence;
    }

    // If it's an object, convert to array
    if (typeof sequence === 'object') {
      return Object.entries(sequence).map(([key, value]) => {
        if (typeof value === 'string') {
          return { title: key, content: value };
        }
        return { title: key, ...(value as object) };
      });
    }

    return [];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden">
      {/* Collapsible Header */}
      <button
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brevo-light rounded-lg flex items-center justify-center">
            <ClipboardList className="h-4 w-4 text-brevo-green" />
          </div>
          <h3 className="font-semibold text-gray-900">{programName}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="border-t border-gray-200 p-4">
          {/* Program Description */}
          {program.description && (
            <p className="text-sm text-gray-600 mb-4">{program.description}</p>
          )}

          {/* Scenarios */}
          {scenarios.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {t.marketingPlan?.noScenariosAvailable || 'No scenarios available'}
            </div>
          ) : (
            <div className="space-y-4">
              {scenarios.map((scenario, scenarioIndex) => {
                const messages = getMessageSequence(scenario);
                const scenarioTarget = scenario.scenario_target || scenario.target || 'General audience';
                const scenarioObjective = scenario.scenario_objective || scenario.objective || '-';
                const mainMessages = scenario.main_messages_ideas || scenario.main_message_ideas || scenario.messages || '-';

                const isScenarioOpen = openScenarios[scenarioIndex] ?? false;

                return (
                  <div key={scenarioIndex} className="bg-gray-50 rounded-lg overflow-hidden">
                    {/* Scenario Header - Clickable Toggle */}
                    <button
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100 transition-colors"
                      onClick={() => toggleScenario(scenarioIndex)}
                    >
                      <h4 className="font-medium text-brevo-green">
                        {t.marketingPlan?.scenario || 'Scenario'} {scenarioIndex + 1}: {scenarioTarget}
                      </h4>
                      {isScenarioOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {/* Scenario Content - Collapsible */}
                    {isScenarioOpen && (
                      <div className="px-4 pb-4">
                        {/* Scenario Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4 text-brevo-green" />
                              <span className="text-xs font-medium text-gray-500">
                                {t.marketingPlan?.target || 'Target'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900">{scenarioTarget}</p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-brevo-green" />
                              <span className="text-xs font-medium text-gray-500">
                                {t.marketingPlan?.objective || 'Objective'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900">{scenarioObjective}</p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageCircle className="h-4 w-4 text-brevo-green" />
                              <span className="text-xs font-medium text-gray-500">
                                {t.marketingPlan?.mainMessages || 'Main Messages'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900">{mainMessages}</p>
                          </div>
                        </div>

                        {/* Message Sequence */}
                        {messages.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <Mail className="h-4 w-4 text-brevo-green" />
                              {t.marketingPlan?.messageSequence || 'Message Sequence'}
                            </h5>
                            <div className="space-y-2">
                              {messages.map((message, msgIndex) => (
                                <div
                                  key={msgIndex}
                                  className="flex flex-col sm:flex-row sm:items-start gap-2 bg-white rounded-lg p-3 border border-gray-100"
                                >
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brevo-light text-brevo-green text-xs font-medium">
                                      {msgIndex + 1}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900">
                                      {message.title || `Message ${msgIndex + 1}`}
                                    </p>
                                    {message.description && (
                                      <p className="text-xs text-gray-500 mt-0.5">{message.description}</p>
                                    )}
                                    {message.content && (
                                      <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgramDetails;
