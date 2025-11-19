import React from 'react';

interface KpiRowProps {
    name: string;
    value: string;
    benchmark: string;
    status: 'good' | 'warning' | 'bad';
    impact: string;
}

export const KpiRowV4 = ({ name, value, benchmark, status, impact }: KpiRowProps) => {
    const statusColors = {
        good: 'bg-green-100 text-green-800 border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        bad: 'bg-red-100 text-red-800 border-red-200',
    };

    const statusDot = {
        good: 'bg-green-500',
        warning: 'bg-yellow-500',
        bad: 'bg-red-500',
    };

    return (
        <div className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200 hover:border-brevo-green/30">
            <div className="flex items-center gap-4 flex-1">
                <div className={`w-2 h-2 rounded-full ${statusDot[status]}`} />
                <div>
                    <h4 className="text-sm font-medium text-gray-900">{name}</h4>
                    <p className="text-xs text-gray-500">Benchmark: {benchmark}</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="text-right">
                    <span className="block text-lg font-bold text-gray-900">{value}</span>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
                    {status === 'good' ? 'On Track' : status === 'warning' ? 'At Risk' : 'Action Needed'}
                </div>

                <div className="w-32 text-right hidden sm:block">
                    <span className="text-xs font-medium text-gray-500 group-hover:text-brevo-green transition-colors">
                        {impact}
                    </span>
                </div>

                <button className="p-2 text-gray-400 hover:text-brevo-green transition-colors rounded-full hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
