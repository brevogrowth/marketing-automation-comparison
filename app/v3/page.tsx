import { Header } from '@/components/Header';
import { HeroSectionV3 } from '@/components/HeroSectionV3';
import { BusinessAssumptions } from '@/components/BusinessAssumptions';
import { CategoryScore } from '@/components/CategoryScore';
import { KpiCardV3 } from '@/components/KpiCardV3';
import { PrioritiesV3 } from '@/components/PrioritiesV3';
import { BrevoSolutionsMapping } from '@/components/BrevoSolutionsMapping';
import { CtaSectionV3 } from '@/components/CtaSectionV3';

// Acquisition KPIs
const acquisitionKpis = [
  {
    title: 'Customer Acquisition Cost (CAC)',
    value: '€32',
    benchmark: '€25-40 (median)',
    position: 'inline' as const,
    whatThisMeans: 'Your CAC is in line with fashion e-commerce peers of similar size.',
    whyItMatters: 'Maintaining efficient acquisition costs allows sustainable scaling while preserving margins.',
    lowDrivers: [
      'Efficient paid channels',
      'Strong organic traffic',
      'Optimized funnels',
    ],
    highDrivers: [
      'Heavy paid reliance',
      'Poor targeting',
      'Low conversion rates',
    ],
  },
  {
    title: 'Share of marketing budget in paid',
    value: '55%',
    benchmark: '40-60% (median)',
    position: 'inline' as const,
    whatThisMeans: 'You allocate a balanced portion of your budget to paid channels.',
    whyItMatters: 'Diversification reduces dependency on volatile paid media costs.',
    lowDrivers: [
      'Over-reliance on owned channels',
      'Limited reach',
      'Slow growth',
    ],
    highDrivers: [
      'High paid dependency',
      'Rising CPCs',
      'Margin pressure',
    ],
  },
];

// Conversion KPIs
const conversionKpis = [
  {
    title: 'Site conversion rate',
    value: '2.1%',
    benchmark: '1.5-2.5% (median)',
    position: 'inline' as const,
    whatThisMeans: 'Your site converts visitors at an average rate for the fashion sector.',
    whyItMatters: 'Even small improvements in conversion directly multiply revenue without increasing traffic costs.',
    lowDrivers: [
      'Poor UX',
      'Weak product pages',
      'Limited trust signals',
    ],
    highDrivers: [
      'Excellent merchandising',
      'Strong social proof',
      'Personalization',
    ],
  },
  {
    title: 'Average Order Value (AOV)',
    value: '€65',
    benchmark: '€40-80 (median)',
    position: 'above' as const,
    whatThisMeans: 'Your basket size is in the upper median range, indicating effective upselling.',
    whyItMatters: 'Higher AOV improves unit economics and shortens CAC payback period.',
    lowDrivers: [
      'No bundling',
      'Limited recommendations',
      'Single-item focus',
    ],
    highDrivers: [
      'Smart bundles',
      'Cross-sell strategies',
      'Premium offerings',
    ],
  },
];

// Engagement & CRM KPIs
const engagementKpis = [
  {
    title: 'Contact activation rate (90d)',
    value: '32%',
    benchmark: '35-50% (median)',
    position: 'below' as const,
    whatThisMeans: 'Only a third of your contact base has interacted with your campaigns recently.',
    whyItMatters: 'Low activation means missed revenue opportunities and higher list decay.',
    lowDrivers: [
      'Infrequent campaigns',
      'Poor segmentation',
      'Irrelevant content',
    ],
    highDrivers: [
      'Automated journeys',
      'Behavior-based triggers',
      'Personalized messaging',
    ],
  },
  {
    title: 'CRM-attributable revenue share',
    value: '12%',
    benchmark: '15-30% (median)',
    position: 'below' as const,
    whatThisMeans: 'Email and SMS channels drive only 12% of your revenue - well below sector average.',
    whyItMatters: 'CRM is the most profitable channel. Underperformance here means leaving money on the table.',
    lowDrivers: [
      'Basic email only',
      'No automation',
      'Generic messaging',
    ],
    highDrivers: [
      'Multi-channel orchestration',
      'Advanced segmentation',
      'Lifecycle campaigns',
    ],
  },
];

// Retention & LTV KPIs
const retentionKpis = [
  {
    title: 'Purchase frequency / year',
    value: '2.1',
    benchmark: '1.5-2.3 (median)',
    position: 'above' as const,
    whatThisMeans: 'Your customers buy slightly more often than the typical fashion brand.',
    whyItMatters: 'Higher frequency multiplies LTV and reduces reliance on constant new acquisition.',
    lowDrivers: [
      'No retention programs',
      'Poor post-purchase engagement',
      'Limited inventory refresh',
    ],
    highDrivers: [
      'Loyalty programs',
      'Regular new drops',
      'Personalized recommendations',
    ],
  },
  {
    title: 'LTV / CAC ratio',
    value: '1.8x',
    benchmark: '2.0-3.0x (median)',
    position: 'below' as const,
    whatThisMeans: 'You earn back 1.8x your acquisition cost over a customer\'s lifetime - below ideal.',
    whyItMatters: 'A ratio below 2x signals unsustainable unit economics and limits growth potential.',
    lowDrivers: [
      'High CAC',
      'Low retention',
      'Short customer lifecycle',
    ],
    highDrivers: [
      'Efficient acquisition',
      'Strong retention',
      'Upsell/cross-sell success',
    ],
  },
];

export default function V3Page() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero + Scorecard */}
        <HeroSectionV3 />

        {/* Business Assumptions */}
        <BusinessAssumptions />

        {/* Acquisition Section */}
        <section className="mb-12">
          <CategoryScore
            title="Acquisition"
            subtitle="Investment and cost efficiency for customer acquisition"
            score="moderate"
            focusMessage="Your CAC is competitive, but consider reducing paid dependency through owned channels."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {acquisitionKpis.map((kpi, index) => (
              <KpiCardV3 key={index} {...kpi} />
            ))}
          </div>
        </section>

        {/* Conversion Section */}
        <section className="mb-12">
          <CategoryScore
            title="Site & Conversion"
            subtitle="Visitor-to-customer conversion efficiency"
            score="moderate"
            focusMessage="Solid AOV, but conversion rate has room for improvement through UX optimization."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conversionKpis.map((kpi, index) => (
              <KpiCardV3 key={index} {...kpi} />
            ))}
          </div>
        </section>

        {/* Engagement & CRM Section */}
        <section className="mb-12">
          <CategoryScore
            title="Engagement & CRM"
            subtitle="Email, SMS, and customer activation performance"
            score="weak"
            focusMessage="This is your biggest opportunity - implement automation and segmentation to unlock 10-15% additional revenue."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engagementKpis.map((kpi, index) => (
              <KpiCardV3 key={index} {...kpi} />
            ))}
          </div>
        </section>

        {/* Retention & LTV Section */}
        <section className="mb-12">
          <CategoryScore
            title="Retention & Customer Value"
            subtitle="Long-term value and customer lifecycle metrics"
            score="moderate"
            focusMessage="Good purchase frequency, but LTV/CAC needs improvement through loyalty programs."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {retentionKpis.map((kpi, index) => (
              <KpiCardV3 key={index} {...kpi} />
            ))}
          </div>
        </section>

        {/* Top 3 Priorities */}
        <PrioritiesV3 />

        {/* Brevo Solutions Mapping */}
        <BrevoSolutionsMapping />

        {/* CTA Section */}
        <CtaSectionV3 />

        {/* Sources & Methodology */}
        <div className="bg-brevo-light border-l-4 border-brevo-green p-6 rounded-lg mb-8">
          <details>
            <summary className="text-lg font-bold text-gray-900 mb-2 cursor-pointer">
              📚 Sources & Methodology
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Benchmark Sources:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-brevo-green font-bold">1</span>
                    <span className="text-sm text-gray-700">
                      Gartner: CMO Spend Survey (fashion & retail vertical)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brevo-green font-bold">2</span>
                    <span className="text-sm text-gray-700">
                      Shopify: E-commerce Benchmarks Report 2024
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brevo-green font-bold">3</span>
                    <span className="text-sm text-gray-700">
                      Klaviyo: Email Marketing Benchmark Study
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brevo-green font-bold">4</span>
                    <span className="text-sm text-gray-700">
                      ProfitWell: SaaS & E-commerce Metrics Database
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How We Calculate Ranges:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Benchmark ranges are based on aggregated, anonymized data from 500+ fashion e-commerce
                  companies with similar revenue profiles (€5M-€20M annually). Low/median/high thresholds
                  represent the 25th, 50th, and 75th percentiles respectively.
                </p>
              </div>
            </div>
          </details>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Brevo. All rights reserved. | Marketing KPI Benchmark - Example Page
          </p>
        </div>
      </footer>
    </div>
  );
}
