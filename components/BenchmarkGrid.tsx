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

    const categories = ['Acquisition', 'Conversion', 'Retention', 'Economics'];

    const getStatus = (kpi: BenchmarkData, userVal: string) => {
        if (!userVal) return 'neutral';
        const val = parseFloat(userVal);
        const range = kpi.ranges[priceTier];

        // Logic depends on KPI type (higher is better vs lower is better)
        // For simplicity, assuming higher is better for most, except CAC, Return Rate, Cart Abandon
        const lowerIsBetter = ['cac', 'return_rate', 'cart_abandon', 'marketing_spend'].includes(kpi.id);

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
                    <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {priceTier} Market Standards
                            </span>
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

                                            {/* Market Range Visual */}
                                            <div className="flex-1 min-w-[300px]">
                                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                    <span>Low: {range.low}{kpi.unit}</span>
                                                    <span className="font-medium text-gray-900">Median: {range.median}{kpi.unit}</span>
                                                    <span>High: {range.high}{kpi.unit}</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                                                    {/* Median Marker */}
                                                    <div className="absolute top-0 bottom-0 bg-gray-300 w-1 left-1/2 transform -translate-x-1/2" />

                                                    {/* User Value Marker (if comparing) */}
                                                    {isComparing && userVal && (
                                                        <div
                                                            className={`absolute top-0 bottom-0 w-2 rounded-full transform -translate-x-1/2 transition-all duration-500 ${status === 'good' ? 'bg-green-500' : status === 'bad' ? 'bg-red-500' : 'bg-yellow-500'
                                                                }`}
                                                            style={{
                                                                left: `${Math.min(Math.max(((parseFloat(userVal) - range.low) / (range.high - range.low)) * 50 + 25, 0), 100)}%`
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* User Input (Comparison Mode) */}
                                            <div className={`w-full md:w-32 transition-opacity duration-300 ${isComparing ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    My Value
                                                </label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <input
                                                        type="number"
                                                        value={userVal}
                                                        onChange={(e) => onValueChange(kpi.id, e.target.value)}
                                                        className={`block w-full rounded-md sm:text-sm p-2 border ${status === 'good' ? 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50' :
                                                                status === 'bad' ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' :
                                                                    'border-gray-300 focus:border-brevo-green focus:ring-brevo-green'
                                                            }`}
                                                        placeholder="-"
                                                    />
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <span className="text-gray-500 sm:text-xs">{kpi.unit}</span>
                                                    </div>
                                                </div>
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
