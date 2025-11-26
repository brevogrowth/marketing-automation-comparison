'use client';

import React, { useState } from 'react';

interface InfoToggle {
    id: string;
    question: string;
    answer: React.ReactNode;
    icon: string;
}

const infoToggles: InfoToggle[] = [
    {
        id: 'what',
        question: 'What is this tool?',
        icon: '🎯',
        answer: (
            <div className="space-y-2">
                <p>
                    This benchmark tool helps you <strong>compare your marketing KPIs</strong> against
                    industry standards for your specific sector and price positioning.
                </p>
                <p>
                    Select your industry, enter your metrics, and get instant visual feedback
                    (green/yellow/red) plus AI-powered strategic recommendations.
                </p>
            </div>
        )
    },
    {
        id: 'data',
        question: 'Where does the data come from?',
        icon: '📊',
        answer: (
            <div className="space-y-2">
                <p>
                    Our benchmarks are compiled from <strong>multiple authoritative sources</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Industry reports (Klaviyo, Omnisend, Mailchimp, HubSpot)</li>
                    <li>E-commerce platforms data (Shopify, BigCommerce)</li>
                    <li>Research firms (Statista, eMarketer, Forrester)</li>
                    <li>SaaS benchmarking studies (OpenView, ChartMogul, ProfitWell)</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">
                    Data is segmented by industry and price tier to ensure relevant comparisons.
                </p>
            </div>
        )
    },
    {
        id: 'how',
        question: 'How to use it?',
        icon: '🚀',
        answer: (
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <span className="bg-brevo-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <p><strong>Select your profile</strong> — Choose your industry and price tier in the sidebar</p>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-brevo-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <p><strong>Enable analysis mode</strong> — Click "Compare my KPIs" to enter your data</p>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-brevo-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <p><strong>Input your metrics</strong> — Use sliders or type values for the KPIs you want to analyze</p>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-brevo-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <p><strong>Get AI insights</strong> — Generate personalized recommendations based on your data</p>
                </div>
            </div>
        )
    }
];

export const IntroBlock = () => {
    const [openToggles, setOpenToggles] = useState<Record<string, boolean>>({});

    const toggleInfo = (id: string) => {
        setOpenToggles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden mb-10">
            {/* Header */}
            <div className="bg-white px-6 py-6 border-b border-gray-200">
                <p className="text-lg md:text-xl font-semibold text-gray-900 leading-relaxed">
                    Compare your performance against industry standards.
                </p>
                <p className="text-base md:text-lg text-gray-600 mt-1">
                    Unlock personalized AI insights to optimize your marketing strategy.
                </p>
            </div>

            {/* Toggles */}
            <div className="divide-y divide-gray-100">
                {infoToggles.map((toggle) => (
                    <div key={toggle.id}>
                        <button
                            onClick={() => toggleInfo(toggle.id)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{toggle.icon}</span>
                                <span className="font-medium text-gray-900">{toggle.question}</span>
                            </div>
                            <svg
                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openToggles[toggle.id] ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Content */}
                        <div className={`overflow-hidden transition-all duration-300 ${openToggles[toggle.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-6 pb-5 pt-1 text-gray-700 text-sm leading-relaxed">
                                {toggle.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
