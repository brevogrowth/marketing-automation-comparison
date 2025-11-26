'use client';

import React, { useState } from 'react';

interface InfoToggle {
    id: string;
    question: string;
    answer: React.ReactNode;
}

const infoToggles: InfoToggle[] = [
    {
        id: 'how',
        question: '🚀 How does it work?',
        answer: (
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <span className="bg-brevo-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <div>
                        <p className="font-semibold text-gray-900">Explore industry benchmarks</p>
                        <p className="text-gray-600">Select your industry and price tier to instantly see key KPIs and market standards. No signup required.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-brevo-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <div>
                        <p className="font-semibold text-gray-900">Compare & get AI recommendations</p>
                        <p className="text-gray-600">Enter your own KPIs to see how you stack up, then generate personalized AI insights to improve your strategy.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'what',
        question: '🎯 What will I learn?',
        answer: (
            <div className="space-y-2">
                <p>Discover how your marketing KPIs <strong>compare to industry leaders</strong> in your sector and price tier.</p>
                <p>Get instant visual feedback (green/yellow/red) on each metric, plus <strong>AI-powered strategic recommendations</strong> tailored to your specific situation.</p>
            </div>
        )
    },
    {
        id: 'data',
        question: '📊 Can I trust this data?',
        answer: (
            <div className="space-y-2">
                <p>Our benchmarks are <strong>curated and validated by industry experts</strong>:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li><strong>Cartelis</strong> — CRM & Marketing Automation consulting</li>
                    <li><strong>Epsilon</strong> — Data-driven marketing expertise</li>
                    <li><strong>Brevo Analytics</strong> — Aggregated insights from 500K+ businesses</li>
                </ul>
                <p className="text-gray-500">Data is segmented by industry and price tier to ensure relevant comparisons.</p>
            </div>
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
