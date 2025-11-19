import React from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

interface Solution {
  title: string;
  description: string;
  impactMetric: string;
  features: string[];
}

const solutions: Solution[] = [
  {
    title: 'Marketing Automation',
    description: 'Orchestrate personalized customer journeys across email, SMS, and push notifications',
    impactMetric: 'Increases CRM revenue share by 8-15%',
    features: [
      'Multi-channel scenario builder',
      'Behavioral triggers and conditions',
      'A/B testing and optimization',
    ],
  },
  {
    title: 'CDP & Segmentation',
    description: 'Unify customer data and create highly targeted segments for precision marketing',
    impactMetric: 'Improves conversion rates by 20-30%',
    features: [
      'Unified customer profiles',
      'Advanced segmentation engine',
      'Real-time data synchronization',
    ],
  },
  {
    title: 'Email & SMS Platform',
    description: 'Deliver engaging campaigns with industry-leading deliverability and personalization',
    impactMetric: 'Reduces CAC by 15-25%',
    features: [
      'Drag-and-drop email builder',
      'SMS and WhatsApp integration',
      'Advanced personalization tokens',
    ],
  },
  {
    title: 'Conversations & Sales CRM',
    description: 'Convert leads faster with integrated chat, CRM, and sales automation',
    impactMetric: 'Shortens sales cycle by 30-40%',
    features: [
      'Live chat and chatbot',
      'Sales pipeline management',
      'Lead scoring and routing',
    ],
  },
];

export const BrevoSolutionsMapping: React.FC = () => {
  return (
    <section className="mb-12">
      <SectionTitle
        title="How Brevo Powers Your Marketing Growth"
        subtitle="Map your priorities to Brevo's integrated marketing platform"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {solutions.map((solution, index) => (
          <Card key={index} className="border-t-4 border-brevo-green hover:shadow-xl transition-shadow">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {solution.description}
              </p>
              <div className="inline-flex items-center gap-2 bg-brevo-light px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-brevo-dark">
                  📈 {solution.impactMetric}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Key Capabilities:</p>
              <ul className="space-y-1">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-brevo-green">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="bg-white border-2 border-brevo-green text-brevo-green hover:bg-brevo-green hover:text-white font-semibold py-3 px-8 rounded-md transition-colors">
          Explore All Brevo Solutions →
        </button>
      </div>
    </section>
  );
};
