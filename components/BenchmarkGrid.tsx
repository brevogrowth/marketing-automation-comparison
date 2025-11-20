import React from 'react';
import { BenchmarkData, PriceTier } from '@/data/retailBenchmarks';

interface BenchmarkGridProps {
    benchmarks: BenchmarkData[];
    priceTier: PriceTier;
    userValues: Record<string, string>;
    isComparing: boolean;
    onValueChange: (id: string, value: string) => void;
}

export const BenchmarkGrid = ({
    benchmarks,
    priceTier,
    userValues,
    isComparing,
    onValueChange
}: BenchmarkGridProps) => {

    const categories = ['Strategic Efficiency', 'Acquisition', 'Conversion', 'Channel Mix', 'Retention', 'Economics'];

    const getStatus = (kpi: BenchmarkData, userVal: string) => {
        if (!userVal) return 'neutral';
        const val = parseFloat(userVal);
        const range = kpi.ranges[priceTier];

        // Logic depends on KPI type (higher is better vs lower is better)
        const lowerIsBetter = ['cac', 'return_rate', 'cart_abandon', 'marketing_spend', 'churn_rate'].includes(kpi.id);

        if (lowerIsBetter) {
            if (val <= range.low) return 'good';
            if (val >= range.high) return 'bad';
            return 'neutral';
        } else {
            if (val >= range.high) return 'good';
            if (val <= range.low) return 'bad';
            return 'neutral';
        }
    };

    return (
        <div className="space-y-12">
            {categories.map(category => {
                const categoryKpis = benchmarks.filter(b => b.category === category);
                if (categoryKpis.length === 0) return null;

                return (
                    <div key={category} className="bg-white rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                        <div className="bg-green-50 px-6 py-4 flex justify-between items-center border-b border-green-100">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-brevo-dark-green">{category}</h3>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {categoryKpis.map(kpi => {
                                const range = kpi.ranges[priceTier];
                                const userVal = userValues[kpi.id] || '';
                                const status = getStatus(kpi, userVal);

                                return (
                                    <div key={kpi.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">

                                            {/* KPI Info */}
                                            <div className="flex-1 min-w-[200px]">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-bold text-gray-900">{kpi.name}</h4>
                                                    <div className="group relative">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded p-2 z-10">
                                                            {kpi.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500">{range.insight}</p>
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
                                                    <div className="animate-fade-in-up">
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
                                                                    if (!userVal) return 'Move the slider to set your value';
                                                                    const val = parseFloat(userVal);
                                                                    const lowerIsBetter = ['cac', 'return_rate', 'cart_abandon', 'marketing_spend', 'churn_rate'].includes(kpi.id);

                                                                    // Define levels: 0=Disaster, 1=Bad, 2=Average, 3=Good, 4=Amazing
                                                                    let level = 2;
                                                                    if (lowerIsBetter) {
                                                                        if (val > range.high * 1.5) level = 0;
                                                                        else if (val > range.high) level = 1;
                                                                        else if (val > range.median) level = 2;
                                                                        else if (val <= range.low * 0.8) level = 4;
                                                                        else level = 3;
                                                                    } else {
                                                                        if (val < range.low * 0.5) level = 0;
                                                                        else if (val < range.low) level = 1;
                                                                        else if (val < range.median) level = 2;
                                                                        else if (val >= range.high * 1.2) level = 4;
                                                                        else level = 3;
                                                                    }

                                                                    const MESSAGES = {
                                                                        0: [ // Disaster
                                                                            "Ouch. Let's pretend this didn't happen. 🙈",
                                                                            "My grandma gets better numbers. And she doesn't have a website.",
                                                                            "Are you trying to lose money? Because it's working.",
                                                                            "I've seen better stats on a broken calculator.",
                                                                            "This is a safe space, but... wow."
                                                                        ],
                                                                        1: [ // Bad
                                                                            "Room for improvement. A lot of it. 😬",
                                                                            "Not quite there yet. Keep pushing!",
                                                                            "You're leaving money on the table.",
                                                                            "Competitors are eating your lunch right now.",
                                                                            "Time to roll up those sleeves."
                                                                        ],
                                                                        2: [ // Average
                                                                            "Average. Just like everyone else. 😐",
                                                                            "Middle of the pack. Safe, but boring.",
                                                                            "Not bad, not great. Just... okay.",
                                                                            "You exist. That's a start.",
                                                                            "Perfectly adequate. If you like adequate."
                                                                        ],
                                                                        3: [ // Good
                                                                            "Not bad! You might actually know what you're doing. 👏",
                                                                            "Solid numbers. Respect.",
                                                                            "You're beating the average. Nice.",
                                                                            "Looking good! Keep it up.",
                                                                            "Finally, some green numbers!"
                                                                        ],
                                                                        4: [ // Amazing
                                                                            "Wow. Are you sure? Cut your salary and take stock options! 🚀",
                                                                            "Unicorn status pending. 🦄",
                                                                            "Stop showing off. (Just kidding, don't stop).",
                                                                            "You're crushing it. Teach us your ways.",
                                                                            "Absolute legend. 🏆"
                                                                        ]
                                                                    };

                                                                    // Deterministic selection based on KPI ID and Level
                                                                    // This ensures the message is stable for a specific KPI at a specific level,
                                                                    // but varies across different KPIs.
                                                                    const msgIndex = (kpi.id.charCodeAt(0) + kpi.id.length + level) % 5;
                                                                    return MESSAGES[level as keyof typeof MESSAGES][msgIndex];
                                                                })()}
                                                            </span>

                                                            {/* Number Input */}
                                                            <div className="relative w-24 flex-shrink-0">
                                                                <input
                                                                    type="number"
                                                                    value={userVal}
                                                                    onChange={(e) => onValueChange(kpi.id, e.target.value)}
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
