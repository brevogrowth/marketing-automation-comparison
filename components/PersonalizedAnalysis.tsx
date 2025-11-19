import React from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

const insights = [
  'You are well-positioned on purchase frequency, but your estimated LTV/CAC around 1.8 remains below the comfort zone (≥ 3.0). You are therefore investing heavily in acquisition for a still limited long-term value.',
  'The share of revenue attributable to CRM (≈ 12%) is low for a sector where advanced players easily exceed 25-30%. There is significant potential to better leverage your customer base.',
  'Your conversion performance is in the market average. The main value creation levers appear to lie more in retention and CRM than in a massive additional effort in paid acquisition.',
];

export const PersonalizedAnalysis: React.FC = () => {
  return (
    <section className="mb-12">
      <SectionTitle
        title="What this means for a player like you"
        subtitle="Based on an average basket of €65 and a purchase frequency of 2.1/year."
      />

      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-brevo-light to-white">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Numerical Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated annual revenue</p>
              <p className="text-2xl font-bold text-brevo-green">€8–12M</p>
              <p className="text-xs text-gray-500 mt-1">(order of magnitude)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Frequency vs sector</p>
              <p className="text-lg font-semibold text-gray-900">2.1 purchases/year</p>
              <p className="text-sm text-gray-600 mt-1">Upper median range</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated LTV</p>
              <p className="text-lg font-semibold text-gray-900">€270–300</p>
              <p className="text-xs text-gray-500 mt-1">Over 2-year relationship</p>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> These are orders of magnitude, to be refined with your internal data.
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">3 Priority Insights</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brevo-green text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed flex-1">{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
