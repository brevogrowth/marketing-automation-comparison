'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { SidebarInputs } from '@/components/SidebarInputs';
import { BenchmarkGrid } from '@/components/BenchmarkGrid';
import { AiAnalysisResult } from '@/components/AiAnalysisResult';
import { IntroBlock } from '@/components/IntroBlock';
import { benchmarks, Industry, PriceTier } from '@/data/benchmarks';

const LOADING_MESSAGES = [
    { title: "Analyzing your data...", subtitle: "Our AI is reviewing your KPIs against industry benchmarks.", step: 1 },
    { title: "Comparing with market data...", subtitle: "Examining thousands of data points from similar businesses.", step: 2 },
    { title: "Identifying opportunities...", subtitle: "Finding the best growth levers for your business.", step: 3 },
    { title: "Crafting recommendations...", subtitle: "Almost there! Generating your personalized strategic insights.", step: 4 }
];

export default function Home() {
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
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [showProcessLogs, setShowProcessLogs] = useState(false);
    const analysisRef = useRef<HTMLDivElement>(null);

    // Rotate loading messages every 20 seconds
    React.useEffect(() => {
        if (!isLoading) {
            setLoadingMessageIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        }, 20000); // 20 seconds

        return () => clearInterval(interval);
    }, [isLoading]);

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
            // Step 1: Create the analysis job
            setLogs(['Starting analysis...']);

            const createResponse = await fetch('/api/analyze', {
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

            if (!createResponse.ok) {
                const errorData = await createResponse.json();
                throw new Error(errorData.error || `HTTP ${createResponse.status}: ${createResponse.statusText}`);
            }

            const { conversationId, status: createStatus } = await createResponse.json();

            if (createStatus !== 'created' || !conversationId) {
                throw new Error('Failed to create analysis job');
            }

            setLogs(prev => [...prev, `Job created (ID: ${conversationId.slice(0, 8)}...)`]);
            setLogs(prev => [...prev, 'Waiting for AI agent to process...']);

            // Step 2: Poll for results
            const MAX_POLLS = 60;  // 60 polls × 5s = 5 minutes max
            const POLL_INTERVAL = 5000; // 5 seconds
            const startTime = Date.now();

            for (let i = 0; i < MAX_POLLS; i++) {
                await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setLogs(prev => [...prev.slice(0, -1), `Polling... (${elapsed}s elapsed)`]);

                const pollResponse = await fetch(`/api/analyze/${conversationId}`);

                if (!pollResponse.ok) {
                    const errorData = await pollResponse.json();
                    throw new Error(errorData.error || `Polling failed: ${pollResponse.status}`);
                }

                const pollData = await pollResponse.json();

                if (pollData.status === 'complete') {
                    setLogs(prev => [...prev, 'Analysis complete!']);
                    setAnalysis(pollData.analysis);
                    setIsLoading(false);
                    return;
                }

                if (pollData.status === 'error') {
                    throw new Error(pollData.error || 'Analysis failed');
                }

                // Still pending - update log with status message
                if (pollData.message) {
                    setLogs(prev => [...prev.slice(0, -1), `${pollData.message} (${elapsed}s)`]);
                }
            }

            // Timeout after 5 minutes
            throw new Error('Analysis timed out after 5 minutes. Please try again.');

        } catch (err: unknown) {
            console.error('Error during analysis:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            setIsLoading(false);
        }
    };

    const currentBenchmarks = benchmarks[industry];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Co-branding Banner */}
            <div className="bg-brevo-dark-green text-white text-center py-2 text-sm font-medium">
                Made by Brevo + Cartelis
            </div>

            <Header />

            {/* Fixed Instruction Banner - Shows when in comparing mode */}
            {isComparing && !showAnalysis && (
                <div className="sticky top-0 z-50 bg-gradient-to-r from-brevo-green to-brevo-dark-green text-white py-3 px-4 shadow-lg">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
                        <p className="text-sm md:text-base font-medium">
                            Pick metrics - Set values - Generate insights
                        </p>
                        <button
                            onClick={handleGenerateAnalysis}
                            className="hidden sm:flex items-center gap-1.5 bg-white text-brevo-dark-green px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
                        >
                            <span>*</span>
                            Generate Analysis
                        </button>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Marketing KPI Benchmark
                    </h1>
                </div>

                {/* Intro Block with Toggles */}
                <IntroBlock />

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
                                    // These 3 KPIs exist across all industries (B2C and B2B)
                                    setSelectedKpis(['cac', 'repeat_rate', 'conv_rate']);
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
                            <div className="mt-12 flex flex-col items-center gap-3">
                                <button
                                    onClick={handleGenerateAnalysis}
                                    className="bg-brevo-green text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-brevo-dark-green transition-all transform hover:-translate-y-1 flex items-center gap-2"
                                >
                                    <span>*</span>
                                    Get My AI Recommendations
                                </button>
                                <p className="text-sm text-gray-500">Free - Takes 2-3 minutes</p>
                            </div>
                        )}

                        {/* AI Analysis Result Section */}
                        {showAnalysis && (
                            <div ref={analysisRef} className="mt-12" id="analysis-section">
                                {/* Section Title */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">* AI Analysis</h2>
                                </div>

                                {/* Loading State & Process Logs - Combined */}
                                {(isLoading || logs.length > 0) && !analysis && !error && (
                                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-6">
                                        {/* Loading Spinner */}
                                        <div className="text-center mb-6">
                                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brevo-green border-t-transparent mb-4"></div>
                                            <p className="text-xs text-brevo-green font-medium mb-2">
                                                Step {LOADING_MESSAGES[loadingMessageIndex].step} of 4
                                            </p>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {LOADING_MESSAGES[loadingMessageIndex].title}
                                            </h3>
                                            <p className="text-gray-500 max-w-2xl mx-auto">
                                                {LOADING_MESSAGES[loadingMessageIndex].subtitle}
                                            </p>
                                        </div>

                                        {/* Process Log - Collapsible */}
                                        {logs.length > 0 && (
                                            <div className="border-t border-gray-100 pt-4">
                                                <button
                                                    onClick={() => setShowProcessLogs(!showProcessLogs)}
                                                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
                                                >
                                                    <span className={`transform transition-transform ${showProcessLogs ? 'rotate-90' : ''}`}>▶</span>
                                                    See process logs ({logs.length})
                                                </button>
                                                {showProcessLogs && (
                                                    <div className="mt-3 space-y-1 text-sm text-gray-600 font-mono max-h-48 overflow-y-auto">
                                                        {logs.map((log, idx) => (
                                                            <div key={idx} className="flex items-start gap-2">
                                                                <span className="text-gray-400 flex-shrink-0">[{idx + 1}]</span>
                                                                <span>{log}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
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
                                        <h3 className="font-bold mb-2">Error</h3>
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
                                Ready to turn insights into growth?
                            </h2>
                            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                                Stop guessing. Start converting.
                                <br className="hidden md:block" />
                                <span className="md:mt-2 md:inline-block">Brevo gives you the complete toolkit—
                                <span className="text-white font-semibold"> CRM, Email, SMS, and Automation</span>—to
                                turn these insights into revenue.</span>
                            </p>
                            <div className="flex justify-center">
                                <a href="https://www.brevo.com/contact/" className="bg-brevo-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brevo-dark-green transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,146,93,0.39)]">
                                    Talk to an Expert
                                </a>
                            </div>
                            <p className="mt-6 text-sm text-gray-400">
                                No commitment required. Get a personalized demo.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
