import React, { useState } from 'react';
import { BenchmarkData, PriceTier } from '@/data/benchmarks';
import { getBenchmarkStatus, getBenchmarkLevel, getHumorousMessage } from '@/utils/benchmarkUtils';
import { metricExplanations } from '@/data/metricExplanations';

interface BenchmarkGridProps {
    benchmarks: BenchmarkData[];
    priceTier: PriceTier;
    userValues: Record<string, string>;
    isComparing: boolean;
    onValueChange: (id: string, value: string) => void;
    selectedKpis: string[];
    onToggleKpi: (id: string) => void;
}

// Category icons for visual distinction
const categoryIcons: Record<string, string> = {
    'Strategic Efficiency': '🎯',
    'Acquisition': '📈',
    'Conversion': '🛒',
    'Channel Mix': '📱',
    'Retention': '🔄',
    'Economics': '💰'
};

export const BenchmarkGrid = ({
    benchmarks,
    priceTier,
    userValues,
    isComparing,
    onValueChange,
    selectedKpis,
    onToggleKpi
}: BenchmarkGridProps) => {

    const categories = ['Strategic Efficiency', 'Acquisition', 'Conversion', 'Channel Mix', 'Retention', 'Economics'];

    // Track which sections are open (all closed by default)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    // Track which "Why this metric?" toggles are open
    const [openExplanations, setOpenExplanations] = useState<Record<string, boolean>>({});

    const toggleSection = (category: string) => {
        setOpenSections(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const toggleExplanation = (metricId: string) => {
        setOpenExplanations(prev => ({ ...prev, [metricId]: !prev[metricId] }));
    };

    const handleToggle = (kpi: BenchmarkData) => {
        const isSelected = selectedKpis.includes(kpi.id);
        onToggleKpi(kpi.id);

        // If selecting and no value exists, pre-fill with median
        if (!isSelected && !userValues[kpi.id]) {
            const range = kpi.ranges[priceTier];
            onValueChange(kpi.id, range.median.toString());
        }
    };

    return (
        <div className="space-y-12">
            {categories.map(category => {
                const categoryKpis = benchmarks.filter(b => b.category === category);
                if (categoryKpis.length === 0) return null;

                const isOpen = openSections[category] ?? false;
                const kpiCount = categoryKpis.length;

                return (
                    <div key={category} className="bg-white rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => toggleSection(category)}
                            className="w-full bg-green-50 px-6 py-4 flex justify-between items-center border-b border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{categoryIcons[category] || '📊'}</span>
                                <h3 className="text-lg font-bold text-brevo-dark-green">{category}</h3>
                                <span className="text-sm text-gray-500 font-normal">({kpiCount} metrics)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg
                                    className={`w-5 h-5 text-brevo-dark-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        <div className={`divide-y divide-gray-100 transition-all duration-300 ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            {categoryKpis.map(kpi => {
                                const range = kpi.ranges[priceTier];
                                const userVal = userValues[kpi.id] || '';
                                const status = getBenchmarkStatus(kpi, userVal, priceTier);
                                const isSelected = selectedKpis.includes(kpi.id);

                                return (
                                    <div key={kpi.id} className={`p-6 transition-colors ${isSelected ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">

                                            {/* KPI Info & Toggle */}
                                            <div className="flex-1 min-w-[200px] flex items-start gap-4">
                                                {isComparing && (
                                                    <div className="pt-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleToggle(kpi)}
                                                            className="w-5 h-5 text-brevo-green rounded border-gray-300 focus:ring-brevo-green cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className={`text-sm font-bold ${isSelected || !isComparing ? 'text-gray-900' : 'text-gray-500'}`}>{kpi.name}</h4>
                                                        <div className="group relative">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                            </svg>
                                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded p-2 z-10">
                                                                {kpi.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-2">{range.insight}</p>

                                                    {/* Why this metric? Toggle */}
                                                    {metricExplanations[kpi.id] && (
                                                        <div className="mt-1">
                                                            <button
                                                                onClick={() => toggleExplanation(kpi.id)}
                                                                className="text-xs text-brevo-green hover:text-brevo-dark-green font-medium flex items-center gap-1 transition-colors"
                                                            >
                                                                <svg
                                                                    className={`w-3 h-3 transition-transform duration-200 ${openExplanations[kpi.id] ? 'rotate-90' : ''}`}
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                                Why this metric?
                                                            </button>

                                                            {/* Explanation Content */}
                                                            <div className={`overflow-hidden transition-all duration-300 ${openExplanations[kpi.id] ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                                                                <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-3 border border-gray-100">
                                                                    {/* Definition */}
                                                                    <div>
                                                                        <h5 className="font-semibold text-gray-900 mb-1">Definition</h5>
                                                                        <p className="text-gray-600">{metricExplanations[kpi.id].definition}</p>
                                                                        {metricExplanations[kpi.id].formula && (
                                                                            <p className="text-gray-500 mt-1 font-mono bg-white px-2 py-1 rounded inline-block">
                                                                                Formula: {metricExplanations[kpi.id].formula}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* Why it matters */}
                                                                    <div>
                                                                        <h5 className="font-semibold text-gray-900 mb-1">Why it matters</h5>
                                                                        <p className="text-gray-600">{metricExplanations[kpi.id].importance}</p>
                                                                    </div>

                                                                    {/* Best practices */}
                                                                    <div>
                                                                        <h5 className="font-semibold text-gray-900 mb-1">Best practices</h5>
                                                                        <ul className="text-gray-600 space-y-1">
                                                                            {metricExplanations[kpi.id].bestPractices.map((practice, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2">
                                                                                    <span className="text-brevo-green mt-0.5">•</span>
                                                                                    <span>{practice}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Combined Market Visual & Input */}
                                            <div className="flex-1 min-w-[300px]">
                                                {/* Market Range Labels */}
                                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                    <span>Low: {range.low}{kpi.unit}</span>
                                                    <span className="font-medium text-gray-900">Median: {range.median}{kpi.unit}</span>
                                                    <span>High: {range.high}{kpi.unit}</span>
                                                </div>

                                                {!isComparing ? (
                                                    /* Static Market Bar (View Only) */
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                                                        <div className="absolute top-0 bottom-0 bg-gray-300 w-1 left-1/2 transform -translate-x-1/2" />
                                                    </div>
                                                ) : (
                                                    /* Interactive Slider (Analysis Mode) */
                                                    <div className={`transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                                                        <div className="relative h-8 flex items-center">
                                                            <input
                                                                type="range"
                                                                min={0}
                                                                max={parseFloat(range.high.toString()) * 2}
                                                                step={kpi.unit === '%' ? 0.1 : 1}
                                                                value={userVal || 0}
                                                                onChange={(e) => onValueChange(kpi.id, e.target.value)}
                                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brevo-green z-10 relative"
                                                            />
                                                            {/* Median Marker on Slider Track */}
                                                            <div
                                                                className="absolute top-3 bottom-3 bg-gray-400 w-0.5 z-0 pointer-events-none"
                                                                style={{ left: '50%' }} // Approximate median for visual reference
                                                            />
                                                        </div>

                                                        <div className="flex justify-between items-start mt-2 gap-4">
                                                            {/* Feedback Text */}
                                                            <span className={`text-xs italic font-medium transition-all duration-300 flex-1 ${status === 'good' ? 'text-brevo-green' :
                                                                status === 'bad' ? 'text-red-500' : 'text-gray-400'
                                                                }`}>
                                                                {(() => {
                                                                    if (!isSelected) return 'Select to analyze';
                                                                    if (!userVal) return 'Move the slider to set your value';

                                                                    const level = getBenchmarkLevel(kpi, userVal, priceTier);
                                                                    return getHumorousMessage(kpi.id, level);
                                                                })()}
                                                            </span>

                                                            {/* Number Input */}
                                                            <div className="relative w-24 flex-shrink-0">
                                                                <input
                                                                    type="number"
                                                                    value={userVal}
                                                                    onChange={(e) => onValueChange(kpi.id, e.target.value)}
                                                                    disabled={!isSelected}
                                                                    className={`block w-full rounded-md sm:text-sm p-1.5 border text-right pr-8 ${status === 'good' ? 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50' :
                                                                        status === 'bad' ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' :
                                                                            'border-gray-200 focus:border-brevo-green focus:ring-brevo-green'
                                                                        }`}
                                                                    placeholder="-"
                                                                />
                                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <span className="text-gray-500 sm:text-xs">{kpi.unit}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
