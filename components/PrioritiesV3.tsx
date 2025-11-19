import React from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

interface Priority {
  number: number;
  category: 'acquisition' | 'conversion' | 'engagement' | 'retention';
  title: string;
  subtitle: string;
  actions: string[];
  brevoHelp: string[];
}

const priorities: Priority[] = [
  {
    number: 1,
    category: 'engagement',
    title: 'Increase CRM-Driven Revenue',
    subtitle: 'Move from 12% to 20-25% of revenue via email/SMS',
    actions: [
      'Implement post-purchase upsell scenarios',
      'Reactivate dormant customers with multi-channel sequences',
      'Launch regular editorial campaigns',
    ],
    brevoHelp: [
      'Marketing Automation scenarios',
      'Advanced segmentation engine',
      'Multi-channel orchestration',
    ],
  },
  {
    number: 2,
    category: 'retention',
    title: 'Improve LTV/CAC Ratio',
    subtitle: 'Target 3x+ by extending customer lifetime value',
    actions: [
      'Create bundle and package offers',
      'Launch loyalty program with points/tiers',
      'Implement expansion revenue strategies',
    ],
    brevoHelp: [
      'Brevo Loyalty platform',
      'Purchase history-based personalization',
      'Predictive analytics',
    ],
  },
  {
    number: 3,
    category: 'acquisition',
    title: 'Reduce Paid Media Dependency',
    subtitle: 'Build owned acquisition channels',
    actions: [
      'Increase email capture on first visit',
      'Launch referral program',
      'Optimize organic and content channels',
    ],
    brevoHelp: [
      'Embedded signup forms',
      'Referral tracking & rewards',
      'Landing page builder',
    ],
  },
];

const categoryColors = {
  acquisition: 'bg-blue-500',
  conversion: 'bg-purple-500',
  engagement: 'bg-orange-500',
  retention: 'bg-green-500',
};

export const PrioritiesV3: React.FC = () => {
  return (
    <section className="mb-12">
      <SectionTitle
        title="Your Top 3 Priorities"
        subtitle="Focus areas ranked by potential impact on revenue and efficiency"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {priorities.map((priority) => (
          <Card
            key={priority.number}
            className="border-t-4 border-brevo-green hover:shadow-lg transition-shadow"
          >
            {/* Header with priority number and category tag */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brevo-green text-white flex items-center justify-center font-bold text-lg">
                  {priority.number}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {priority.title}
                  </h3>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${categoryColors[priority.category]}`} />
            </div>

            <p className="text-sm text-gray-600 mb-4">{priority.subtitle}</p>

            {/* Actions */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Key Actions:</h4>
              <ul className="space-y-2">
                {priority.actions.map((action, index) => (
                  <li key={index} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-brevo-green font-bold">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brevo Help */}
            <div className="bg-brevo-light rounded-lg p-3">
              <h4 className="font-semibold text-brevo-dark text-xs mb-2">
                How Brevo Helps:
              </h4>
              <ul className="space-y-1">
                {priority.brevoHelp.map((help, index) => (
                  <li key={index} className="flex gap-2 text-xs text-gray-700">
                    <span className="text-brevo-green">✓</span>
                    <span>{help}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Category legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-600">Acquisition</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-gray-600">Conversion</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-600">Engagement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Retention</span>
        </div>
      </div>
    </section>
  );
};
