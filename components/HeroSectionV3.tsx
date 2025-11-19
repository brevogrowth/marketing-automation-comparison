import React from 'react';
import { Card } from './Card';

interface ScoreIndicator {
  label: string;
  value: string;
  trend: 'up' | 'neutral' | 'down';
}

const keyIndicators: ScoreIndicator[] = [
  { label: 'Acquisition Efficiency', value: 'Strong', trend: 'up' },
  { label: 'CRM Revenue Share', value: 'Below Average', trend: 'down' },
  { label: 'Customer Lifetime Value', value: 'Moderate', trend: 'neutral' },
];

export const HeroSectionV3: React.FC = () => {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Title + Sector Badge */}
        <div>
          <div className="inline-flex items-center gap-2 bg-brevo-light border border-brevo-green rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-medium text-brevo-dark">
              E-commerce • Fashion & Accessories • Europe
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            How your marketing performance compares to peers
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            Based on your profile (€65 avg basket, 2.1 purchases/year), here's your marketing health check against industry benchmarks.
          </p>
        </div>

        {/* Right: Scorecard */}
        <Card className="bg-gradient-to-br from-brevo-light to-white border-2 border-brevo-green">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Marketing Health Score</h2>
              <div className="text-4xl font-bold text-brevo-green">73/100</div>
            </div>
            <p className="text-sm text-gray-600">
              Solid foundation with significant CRM upside potential
            </p>
          </div>

          <div className="space-y-3">
            {keyIndicators.map((indicator, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    indicator.trend === 'up' ? 'bg-green-500' :
                    indicator.trend === 'down' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">{indicator.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${
                    indicator.trend === 'up' ? 'text-green-700' :
                    indicator.trend === 'down' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    {indicator.value}
                  </span>
                  <span className="text-lg">
                    {indicator.trend === 'up' ? '↑' : indicator.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-brevo-green hover:bg-brevo-dark text-white font-semibold py-3 px-6 rounded-md transition-colors">
            Get Full Benchmark Report
          </button>
        </Card>
      </div>
    </section>
  );
};
