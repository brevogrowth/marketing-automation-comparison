'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const IntroBlock = () => {
    const [openToggle, setOpenToggle] = useState<string | null>(null);
    const { t } = useLanguage();

    const infoToggles = [
        {
            id: 'how',
            question: `${t.intro.how.question}`,
            answer: (
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="bg-brevo-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                        <div>
                            <p className="font-semibold text-gray-900">{t.intro.how.step1Title}</p>
                            <p className="text-gray-600">{t.intro.how.step1Desc}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-brevo-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                        <div>
                            <p className="font-semibold text-gray-900">{t.intro.how.step2Title}</p>
                            <p className="text-gray-600">{t.intro.how.step2Desc}</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'what',
            question: `${t.intro.what.question}`,
            answer: (
                <div className="space-y-2">
                    <p dangerouslySetInnerHTML={{ __html: t.intro.what.answer1 }} />
                    <p dangerouslySetInnerHTML={{ __html: t.intro.what.answer2 }} />
                </div>
            )
        },
        {
            id: 'data',
            question: `${t.intro.data.question}`,
            answer: (
                <div className="space-y-2">
                    <p dangerouslySetInnerHTML={{ __html: t.intro.data.intro }} />
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li dangerouslySetInnerHTML={{ __html: t.intro.data.cartelis }} />
                        <li dangerouslySetInnerHTML={{ __html: t.intro.data.epsilon }} />
                        <li dangerouslySetInnerHTML={{ __html: t.intro.data.brevo }} />
                    </ul>
                    <p className="text-gray-500">{t.intro.data.note}</p>
                </div>
            )
        }
    ];

    const toggleInfo = (id: string) => {
        setOpenToggle(prev => prev === id ? null : id);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            {/* Compact Toggles - Horizontal on desktop */}
            <div className="flex flex-col sm:flex-row sm:divide-x divide-y sm:divide-y-0 divide-gray-200">
                {infoToggles.map((toggle) => (
                    <div key={toggle.id} className="flex-1">
                        <button
                            onClick={() => toggleInfo(toggle.id)}
                            className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${openToggle === toggle.id ? 'bg-brevo-light' : ''}`}
                        >
                            <span className="text-sm font-medium text-gray-700">{toggle.question}</span>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openToggle === toggle.id ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Expanded Content */}
            {openToggle && (
                <div className="px-4 py-4 bg-white border-t border-gray-200 text-sm text-gray-700">
                    {infoToggles.find(t => t.id === openToggle)?.answer}
                </div>
            )}
        </div>
    );
};
