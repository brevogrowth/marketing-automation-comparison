'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { SidebarInputs } from '@/components/SidebarInputs';
import { BenchmarkGrid } from '@/components/BenchmarkGrid';
import { AiAnalysisResult } from '@/components/AiAnalysisResult';
import { retailBenchmarks, Industry, PriceTier } from '@/data/retailBenchmarks';

export default function V4Page() {
    const [industry, setIndustry] = useState<Industry>('Fashion');
    const [priceTier, setPriceTier] = useState<PriceTier>('Mid-Range');
    const [isComparing, setIsComparing] = useState(false);
    const [userValues, setUserValues] = useState<Record<string, string>>({});
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [selectedKpis, setSelectedKpis] = useState<string[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const analysisRef = useRef<HTMLDivElement>(null);

    const handleValueChange = (id: string, value: string) => {
        setUserValues(prev => ({ ...prev, [id]: value }));
    };

    const handleToggleKpi = (id: string) => {
        setSelectedKpis(prev =>
            prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
        );
    };

    const handleGenerateAnalysis = async () => {
        setShowAnalysis(true);
        setIsLoading(true);
        setLogs([]);
        setAnalysis('');
        setError(null);

        // Scroll to analysis section
        setTimeout(() => {
            analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        // Filter values to only include selected KPIs
        const selectedValues = Object.fromEntries(
            Object.entries(userValues).filter(([key]) => selectedKpis.includes(key))
        );

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userValues: selectedValues,
                    priceTier,
                    industry
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Keep the last incomplete line in the buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const payload = JSON.parse(line.slice(6));

                            if (payload.type === 'log') {
                                setLogs(prev => [...prev, payload.data]);
                            } else if (payload.type === 'text') {
                                console.log('[TEXT RECEIVED]', payload.data);
                                setAnalysis(prev => prev + payload.data);
                            } else if (payload.type === 'error') {
                                setError(payload.data);
                                setIsLoading(false);
                            }
                        } catch (e) {
                            console.warn('Failed to parse SSE line:', line);
                        }
                    }
                }
            }

            setIsLoading(false);

        } catch (err: any) {
            console.error('Error starting analysis:', err);
            setError(err.message || 'An unexpected error occurred');
            setIsLoading(false);
        }
    };

    const currentBenchmarks = retailBenchmarks[industry];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Co-branding Banner */}
            <div className="bg-brevo-dark-green text-white text-center py-2 text-sm font-medium">
                Made by Brevo + Cartelis
            </div>

            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Marketing KPI Benchmark <span className="text-brevo-green">v4</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Compare your performance against B2C Retail standards.
                        Unlock personalized AI insights to optimize your strategy.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Business Profile */}
                    <div className="lg:w-1/4">
                        <SidebarInputs
                            industry={industry}
                            setIndustry={setIndustry}
                            priceTier={priceTier}
                            setPriceTier={setPriceTier}
                            isComparing={isComparing}
                            setIsComparing={(val) => {
                                setIsComparing(val);
                                if (val) {
                                    // Auto-select critical KPIs when entering analysis mode
                                    // Selecting a few key metrics by default as requested
                                    setSelectedKpis(['cac', 'retention_rate', 'conversion_rate']);
                                } else {
                                    setShowAnalysis(false);
                                    setSelectedKpis([]);
                                }
                            }}
                        />
                    </div>

                    {/* Main Content - Benchmark Grid */}
                    <div className="lg:w-3/4">
                        <BenchmarkGrid
                            benchmarks={currentBenchmarks}
                            priceTier={priceTier}
                            userValues={userValues}
                            isComparing={isComparing}
                            onValueChange={handleValueChange}
                            selectedKpis={selectedKpis}
                            onToggleKpi={handleToggleKpi}
                        />

                        {/* Analysis Action */}
                        {isComparing && !showAnalysis && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={handleGenerateAnalysis}
                                    className="bg-brevo-green text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-brevo-dark-green transition-all transform hover:-translate-y-1 flex items-center gap-2"
                                >
                                    <span>✨</span>
                                    Generate AI Analysis
                                </button>
                            </div>
                        )}

                        {/* AI Analysis Result Section */}
                        {showAnalysis && (
                            <div ref={analysisRef} className="mt-12" id="analysis-section">
                                {/* Section Title */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">✨ AI Analysis</h2>
                                </div>

                                {/* Loading State & Process Logs - Combined */}
                                {(isLoading || logs.length > 0) && !analysis && !error && (
                                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-6">
                                        {/* Loading Spinner */}
                                        <div className="text-center mb-6">
                                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brevo-green border-t-transparent mb-4"></div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing your data...</h3>
                                            <p className="text-gray-500">Our AI agent is crafting your personalized strategy</p>
                                        </div>

                                        {/* Process Log */}
                                        {logs.length > 0 && (
                                            <div className="border-t border-gray-100 pt-6">
                                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                    <span className="text-brevo-green">●</span> Process Log
                                                </h3>
                                                <div className="space-y-1 text-sm text-gray-600 font-mono max-h-48 overflow-y-auto">
                                                    {logs.map((log, idx) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <span className="text-gray-400 flex-shrink-0">[{idx + 1}]</span>
                                                            <span>{log}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Analysis Result */}
                                {analysis && (
                                    <AiAnalysisResult analysis={analysis} />
                                )}

                                {/* Error Display */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
                                        <h3 className="font-bold mb-2">❌ Error</h3>
                                        <p>{error}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24">
                    <div className="bg-[#0B1221] rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-brevo-green opacity-20 blur-[100px] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-20 blur-[120px] rounded-full transform translate-x-1/3 translate-y-1/3"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                Ready to beat the benchmarks?
                            </h2>
                            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                                Stop guessing. Start converting. Brevo gives you the complete toolkit—
                                <span className="text-white font-semibold"> CRM, Email, SMS, and Automation</span>—to
                                turn these insights into revenue.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <a href="#" className="bg-brevo-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brevo-dark-green transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,146,93,0.39)]">
                                    Get Started for Free
                                </a>
                                <a href="#" className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                                    Book a Demo
                                </a>
                            </div>
                            <p className="mt-6 text-sm text-gray-400">
                                No credit card required. 100% free plan available.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
