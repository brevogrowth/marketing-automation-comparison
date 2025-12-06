'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronUp, ChevronDown } from 'lucide-react';

type AccordionSection = 'what' | 'how' | 'trust' | null;

export const IntroAccordion: React.FC = () => {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<AccordionSection>('what');

  const toggleSection = (section: AccordionSection) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      {/* Accordion Headers Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* What is a relationship plan? */}
        <button
          onClick={() => toggleSection('what')}
          className={`flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 ${
            openSection === 'what' ? 'bg-gray-50' : ''
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
          className={`flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 ${
            openSection === 'how' ? 'bg-gray-50' : ''
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
          className={`flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 ${
            openSection === 'trust' ? 'bg-gray-50' : ''
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
        <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
          {/* What is a relationship plan? - Content */}
          {openSection === 'what' && (
            <div className="space-y-4">
              <p className="text-gray-700">
                {t.intro?.what?.intro || 'A marketing relationship plan is your roadmap for building lasting customer connections through automated, personalized communication.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t.intro?.what?.programsTitle || 'Marketing Programs'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.intro?.what?.programsDesc || 'Structured campaigns like Welcome Series, Cart Abandonment, Win-Back, and Loyalty programs — each designed for a specific customer lifecycle stage.'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="text-2xl mb-2">📧</div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t.intro?.what?.scenariosTitle || 'Automated Scenarios'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.intro?.what?.scenariosDesc || 'Pre-built message sequences with triggers, timing, and content ideas — ready to be implemented in your marketing automation platform.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* How does it work? - Content */}
          {openSection === 'how' && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brevo-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t.intro?.how?.step1Title || 'Choose your industry'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.intro?.how?.step1Desc || 'Select from 12 industries (Fashion, Beauty, SaaS, etc.) to get a plan with relevant programs, messaging, and KPIs tailored to your sector.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brevo-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t.intro?.how?.step2Title || 'Get your template instantly'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.intro?.how?.step2Desc || 'View a complete relationship plan with 4-6 marketing programs, each with scenarios and message sequences. No signup required.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✨</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t.intro?.how?.step3Title || 'Or get AI personalization'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.intro?.how?.step3Desc || 'Enter your company domain and our AI analyzes your business to create a fully customized plan with specific recommendations for your brand.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Can I trust this plan? - Content */}
          {openSection === 'trust' && (
            <div className="space-y-4">
              <p className="text-gray-700">
                {t.intro?.trust?.intro || 'Absolutely! Our plans are built on proven marketing frameworks and real-world expertise:'}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-xl">🏆</span>
                  <div>
                    <span className="font-semibold text-gray-900">{t.intro?.trust?.expertiseTitle || 'Industry Expertise'}</span>
                    <p className="text-sm text-gray-600">
                      {t.intro?.trust?.expertiseDesc || 'Developed with Cartelis, a leading CRM & Marketing Automation consulting firm with 10+ years of experience.'}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <span className="font-semibold text-gray-900">{t.intro?.trust?.dataTitle || 'Data-Driven'}</span>
                    <p className="text-sm text-gray-600">
                      {t.intro?.trust?.dataDesc || 'Based on aggregated insights from 500,000+ businesses using Brevo worldwide, across all industries and company sizes.'}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🤖</span>
                  <div>
                    <span className="font-semibold text-gray-900">{t.intro?.trust?.aiTitle || 'AI-Powered'}</span>
                    <p className="text-sm text-gray-600">
                      {t.intro?.trust?.aiDesc || 'Our AI is trained on best practices from successful marketing campaigns, ensuring recommendations are both creative and effective.'}
                    </p>
                  </div>
                </li>
              </ul>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 italic">
                  {t.intro?.trust?.note || '"These plans are starting points. Customize them based on your brand voice, audience insights, and business goals."'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
