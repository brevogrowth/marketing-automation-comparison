import React from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

const categories = [
  {
    label: 'Acquisition',
    level: 'medium to high',
    description:
      "In online fashion, acquisition costs remain under pressure. There's still heavy reliance on paid media, with median CAC between €25 and €40.",
  },
  {
    label: 'Site & Conversion',
    level: '',
    description:
      'Top performers convert between 2.5% and 3.5% of sessions. The majority of the market still ranges between 1.5% and 2.5%.',
  },
  {
    label: 'Engagement & CRM',
    level: '',
    description:
      'Email remains a highly profitable channel: median open rate around 23-26%, with significant potential for those who structure automated scenarios.',
  },
  {
    label: 'Retention & Value',
    level: '',
    description:
      'Median purchase frequency is around 1.6-2.0 orders per year. The most advanced brands reach 2.5-3.0.',
  },
];

export const OverviewByCategory: React.FC = () => {
  return (
    <section className="mb-12">
      <SectionTitle
        title="Funnel Stage Overview"
        subtitle="This view aggregates KPIs by major stages: acquisition, conversion, CRM engagement, and retention & customer value."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900">{category.label}</h3>
              {category.level && (
                <span className="text-sm font-medium text-brevo-green px-3 py-1 bg-brevo-light rounded-full">
                  Level: {category.level}
                </span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">{category.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};
