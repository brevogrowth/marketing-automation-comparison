'use client';

import React, { useState } from 'react';

interface InfoToggle {
    id: string;
    question: string;
    answer: React.ReactNode;
}

const infoToggles: InfoToggle[] = [
    {
        id: 'what',
        question: 'What will I learn?',
        answer: (
            <p>
                Compare your KPIs to industry leaders and get <strong>AI-powered recommendations</strong> tailored to your business.
            </p>
        )
    },
    {
        id: 'data',
        question: 'Can I trust this data?',
        answer: (
            <p>
                Benchmarks curated by <strong>Cartelis</strong>, <strong>Epsilon</strong>, and <strong>Brevo Analytics</strong> (500K+ businesses), segmented by industry and price tier.
            </p>
        )
    },
    {
        id: 'how',
        question: 'How does it work?',
        answer: (
            <p>
                <strong>1.</strong> Select your industry <strong>2.</strong> Click "Enter My KPIs" <strong>3.</strong> Set your values <strong>4.</strong> Generate AI insights
            </p>
        )
    }
];

export const IntroBlock = () => {
    const [openToggle, setOpenToggle] = useState<string | null>(null);

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
                            className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${openToggle === toggle.id ? 'bg-gray-50' : ''}`}
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
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                    {infoToggles.find(t => t.id === openToggle)?.answer}
                </div>
            )}
        </div>
    );
};
