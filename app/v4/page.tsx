'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { SidebarInputs } from '@/components/SidebarInputs';
import { BenchmarkGrid } from '@/components/BenchmarkGrid';
import { retailBenchmarks, Industry, PriceTier } from '@/data/retailBenchmarks';

export default function V4Page() {
    const [industry, setIndustry] = useState<Industry>('Fashion');
    const [priceTier, setPriceTier] = useState<PriceTier>('Mid-Range');
    const [isComparing, setIsComparing] = useState(false);
    const [userValues, setUserValues] = useState<Record<string, string>>({});

    const handleValueChange = (id: string, value: string) => {
        setUserValues(prev => ({ ...prev, [id]: value }));
    };

    const currentBenchmarks = retailBenchmarks[industry];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Sidebar - Sticky on Desktop */}
                    <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
                        <SidebarInputs
                            industry={industry}
                            setIndustry={setIndustry}
                            priceTier={priceTier}
                            setPriceTier={setPriceTier}
                            isComparing={isComparing}
                            setIsComparing={setIsComparing}
                        />
                    </aside>

                    {/* Main Content - Scrollable */}
                    <div className="flex-1 w-full">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-brevo-green/10 text-brevo-green text-xs font-bold uppercase tracking-wide">
                                    {industry} • {priceTier}
                                </span>
                                <span className="text-gray-400 text-sm">|</span>
                                <span className="text-gray-500 text-sm">Updated Nov 2024</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {isComparing ? 'Your Performance Analysis' : 'Market Standard Benchmarks'}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {isComparing
                                    ? 'Compare your metrics against the industry standard. Red indicators suggest areas for immediate optimization.'
                                    : 'Explore the standard KPIs for your industry. Click "Compare My Numbers" to benchmark your performance.'
                                }
                            </p>
                        </div>

                        <BenchmarkGrid
                            benchmarks={currentBenchmarks}
                            priceTier={priceTier}
                            userValues={userValues}
                            isComparing={isComparing}
                            onValueChange={handleValueChange}
                        />

                        <div className="mt-12 bg-brevo-dark-green text-white p-8 rounded-xl shadow-lg text-center">
                            <h3 className="text-2xl font-bold mb-4">Want to beat these benchmarks?</h3>
                            <p className="text-brevo-light/90 mb-8 max-w-2xl mx-auto text-lg">
                                Brevo's all-in-one platform helps you optimize every stage of the customer journey, from acquisition to retention.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button className="px-8 py-4 bg-white text-brevo-dark-green font-bold rounded-lg hover:bg-gray-100 transition-colors">
                                    Start Free Trial
                                </button>
                                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                                    Talk to Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
