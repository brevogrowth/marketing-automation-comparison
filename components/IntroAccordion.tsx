'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronUp, ChevronDown } from 'lucide-react';

type AccordionSection = 'how' | 'what' | 'data' | null;

export const IntroAccordion: React.FC = () => {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<AccordionSection>('how');

  const toggleSection = (section: AccordionSection) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      {/* Accordion Headers Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
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
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {/* What will I learn? */}
        <button
          onClick={() => toggleSection('what')}
          className={`flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 ${
            openSection === 'what' ? 'bg-gray-50' : ''
          }`}
        >
          <span className="font-medium text-gray-900">
            {t.intro?.what?.question || 'What will I get?'}
          </span>
          {openSection === 'what' ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {/* Can I trust this data? */}
        <button
          onClick={() => toggleSection('data')}
          className={`flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 ${
            openSection === 'data' ? 'bg-gray-50' : ''
          }`}
        >
          <span className="font-medium text-gray-900">
            {t.intro?.data?.question || 'Is this powered by AI?'}
          </span>
          {openSection === 'data' ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Accordion Content */}
      {openSection && (
        <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
          {/* How does it work? - Content */}
          {openSection === 'how' && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brevo-green rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {t.intro?.how?.step1Title || 'Select your industry'}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {t.intro?.how?.step1Desc || 'Choose from 12 industries to get a tailored marketing relationship plan.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brevo-green rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {t.intro?.how?.step2Title || 'Get AI-powered personalization'}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {t.intro?.how?.step2Desc || 'Enter your company domain to receive a fully personalized plan with specific recommendations.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What will I learn? - Content */}
          {openSection === 'what' && (
            <div className="space-y-3">
              <p
                className="text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: t.intro?.what?.answer1 || 'A complete <strong>marketing relationship strategy</strong> with email, SMS, and automation programs tailored to your industry.'
                }}
              />
              <p
                className="text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: t.intro?.what?.answer2 || 'Concrete <strong>scenarios and message sequences</strong> ready to implement with Brevo\'s omnichannel platform.'
                }}
              />
            </div>
          )}

          {/* Is this powered by AI? - Content */}
          {openSection === 'data' && (
            <div className="space-y-3">
              <p
                className="text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: t.intro?.data?.intro || 'Yes! Our plans are <strong>generated by advanced AI</strong> trained on marketing best practices:'
                }}
              />
              <ul className="space-y-2 ml-4">
                <li
                  className="text-gray-600 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: t.intro?.data?.cartelis || '<strong>Cartelis</strong> — CRM & Marketing Automation expertise'
                  }}
                />
                <li
                  className="text-gray-600 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: t.intro?.data?.brevo || '<strong>Brevo</strong> — Insights from 500K+ businesses worldwide'
                  }}
                />
              </ul>
              <p className="text-gray-500 text-sm italic mt-2">
                {t.intro?.data?.note || 'Plans are customized based on your industry and company analysis.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
