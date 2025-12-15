'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronUp, ChevronDown, Zap, Sparkles, ExternalLink } from 'lucide-react';

type AccordionSection = 'what' | 'how' | 'trust' | null;

export const IntroAccordion: React.FC = () => {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<AccordionSection>(null);

  const toggleSection = (section: AccordionSection) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="my-10">
      {/* Accordion Headers Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* What is a relationship plan? */}
        <button
          onClick={() => toggleSection('what')}
          className={`flex items-center justify-between px-6 py-4 text-left rounded-xl border transition-all duration-200 ${
            openSection === 'what'
              ? 'bg-white border-gray-300 shadow-sm'
              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <span className="font-medium text-gray-900">
            {t.intro?.what?.question || 'What is a "relationship plan"?'}
          </span>
          {openSection === 'what' ? (
            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
          )}
        </button>

        {/* How does it work? */}
        <button
          onClick={() => toggleSection('how')}
          className={`flex items-center justify-between px-6 py-4 text-left rounded-xl border transition-all duration-200 ${
            openSection === 'how'
              ? 'bg-white border-gray-300 shadow-sm'
              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <span className="font-medium text-gray-900">
            {t.intro?.how?.question || 'How does it work?'}
          </span>
          {openSection === 'how' ? (
            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
          )}
        </button>

        {/* Can I trust this plan? */}
        <button
          onClick={() => toggleSection('trust')}
          className={`flex items-center justify-between px-6 py-4 text-left rounded-xl border transition-all duration-200 ${
            openSection === 'trust'
              ? 'bg-white border-gray-300 shadow-sm'
              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <span className="font-medium text-gray-900">
            {t.intro?.trust?.question || 'Can I trust this plan?'}
          </span>
          {openSection === 'trust' ? (
            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
          )}
        </button>
      </div>

      {/* Accordion Content */}
      {openSection && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
          {/* What is a relationship plan? - Content */}
          {openSection === 'what' && (
            <div className="space-y-4">
              <p className="text-gray-700">
                {t.intro?.what?.intro || 'A marketing relationship plan is a strategic document that structures your CRM and marketing automation initiatives to build lasting customer relationships.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t.intro?.what?.programsTitle || 'Marketing Programs'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.intro?.what?.programsDesc || 'Coordinated action sets targeting specific objectives: Welcome, Loyalty, Reactivation, Cart Abandonment, Referral — each aligned to a customer lifecycle stage.'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="text-2xl mb-2">📧</div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t.intro?.what?.scenariosTitle || 'Automated Scenarios'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.intro?.what?.scenariosDesc || 'Message sequences triggered by customer behavior: welcome emails, post-purchase follow-ups, win-back campaigns — orchestrating the entire customer journey.'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {t.intro?.what?.sourceLabel || 'Methodology:'}{' '}
                <a
                  href="https://www.cartelis.com/blog/plan-marketing-relationnel-exemple/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brevo-green hover:underline inline-flex items-center gap-1"
                >
                  Cartelis <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          )}

          {/* How does it work? - Two Levels */}
          {openSection === 'how' && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                {t.intro?.how?.intro || 'Two ways to get your relationship marketing plan:'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Mode */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-brevo-green rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {t.intro?.how?.quickTitle || 'Quick Mode'}
                      </h4>
                      <span className="text-xs text-brevo-green font-medium">
                        {t.intro?.how?.quickBadge || 'Instant • No signup'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {t.intro?.how?.quickDesc || 'Select your industry and instantly get a template plan with 4-6 proven marketing programs tailored to your sector.'}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-brevo-green">✓</span>
                      {t.intro?.how?.quickFeature1 || '12 industries available'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brevo-green">✓</span>
                      {t.intro?.how?.quickFeature2 || 'Ready-to-use scenarios'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brevo-green">✓</span>
                      {t.intro?.how?.quickFeature3 || 'Industry best practices'}
                    </li>
                  </ul>
                </div>

                {/* Personalized Mode */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-5 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {t.intro?.how?.personalizedTitle || 'Personalized Mode'}
                      </h4>
                      <span className="text-xs text-purple-600 font-medium">
                        {t.intro?.how?.personalizedBadge || '~3 min • AI-powered'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {t.intro?.how?.personalizedDesc || 'Enter your company domain and our AI analyzes your business to generate a fully customized plan with specific recommendations.'}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">✓</span>
                      {t.intro?.how?.personalizedFeature1 || 'Website analysis'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">✓</span>
                      {t.intro?.how?.personalizedFeature2 || 'Custom recommendations'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">✓</span>
                      {t.intro?.how?.personalizedFeature3 || 'Brand-specific messaging'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Can I trust this plan? - Honest Content */}
          {openSection === 'trust' && (
            <div className="space-y-4">
              <p className="text-gray-700">
                {t.intro?.trust?.intro || 'We believe in transparency. Here\'s exactly how these plans are created:'}
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📚</span>
                  <div>
                    <span className="font-semibold text-gray-900">{t.intro?.trust?.frameworkTitle || 'Framework'}</span>
                    <p className="text-sm text-gray-600">
                      {t.intro?.trust?.frameworkDesc || 'The structure follows the Marketing Relationship Plan methodology developed by'}{' '}
                      <a
                        href="https://www.cartelis.com/blog/plan-marketing-relationnel-exemple/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brevo-green hover:underline inline-flex items-center gap-1"
                      >
                        Cartelis <ExternalLink className="w-3 h-3 inline" />
                      </a>
                      {t.intro?.trust?.frameworkDesc2 || ', a French CRM & Marketing Automation consulting firm.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">🤖</span>
                  <div>
                    <span className="font-semibold text-gray-900">{t.intro?.trust?.aiTitle || 'AI Generation'}</span>
                    <p className="text-sm text-gray-600">
                      {t.intro?.trust?.aiDesc || 'Personalized plans are generated by an AI we\'ve refined with dozens of real examples. Template plans are curated by our team.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">🎯</span>
                  <div>
                    <span className="font-semibold text-gray-900">{t.intro?.trust?.purposeTitle || 'Purpose'}</span>
                    <p className="text-sm text-gray-600">
                      {t.intro?.trust?.purposeDesc || 'These plans are starting points to inspire your strategy. They\'re not a substitute for professional consulting.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Honest Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">{t.intro?.trust?.disclaimerTitle || 'Important:'}</span>{' '}
                  {t.intro?.trust?.disclaimerText || 'AI-generated content may contain inaccuracies or "hallucinations." Always validate recommendations against your business knowledge and goals before implementing.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
