import { Header } from '@/components/Header';
import { HeroSectionV2 } from '@/components/HeroSectionV2';
import { CompanyProfileCard } from '@/components/CompanyProfileCard';
import { BusinessAssumptionsV2 } from '@/components/BusinessAssumptionsV2';
import { SectionTitle } from '@/components/SectionTitle';
import { KpiCard } from '@/components/KpiCard';

// Acquisition KPIs
const acquisitionKpis = [
  {
    title: 'Marketing spend as % of revenue',
    value: '8% - 25%',
    threshold: '18%',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Limited brand awareness growth potential',
      'Risk of losing market share to competitors',
      'Slow lead gen velocity vs company targets',
    ],
    highExamples: [
      'Aggressive market positioning and brand development',
      'Strategic investment in high-impact acquisition',
      'Building sustainable competitive advantages',
    ],
  },
  {
    title: 'Customer Acquisition Cost (CAC)',
    value: '< $1,500',
    threshold: '$1,200',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Efficient digital acquisition strategies',
      'Strong word-of-mouth and referral programs',
      'Optimized conversion funnels reducing waste',
    ],
    highExamples: [
      'Heavy reliance on expensive paid channels',
      'Long, complex sales cycles without optimization',
      'Inefficient targeting leading to low conversion',
    ],
  },
  {
    title: 'Share of budget: lead generation (%)',
    value: '30% - 50%',
    threshold: '40%',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Insufficient top-of-funnel investment',
      'Over-reliance on existing customer base',
      'Limited new customer acquisition capacity',
    ],
    highExamples: [
      'Strong demand generation investment',
      'Balanced top-of-funnel and nurture spend',
      'Scalable lead acquisition programs',
    ],
  },
];

// Conversion & Pipeline KPIs
const conversionKpis = [
  {
    title: 'Lead-to-customer conversion rate',
    value: '> 10%',
    threshold: '12%',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Poor lead quality affecting conversion',
      'Ineffective sales process or enablement',
      'Misaligned marketing and sales strategies',
    ],
    highExamples: [
      'High-quality lead generation and scoring',
      'Optimized sales processes and enablement',
      'Strong alignment between marketing and sales',
    ],
  },
  {
    title: 'Average Order Value (AOV)',
    value: '$5k - $50k',
    threshold: '$18k',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Limited upselling and cross-selling efforts',
      'Smaller deals limiting revenue per customer',
      'Lack of premium or enterprise tier offerings',
    ],
    highExamples: [
      'Successful bundling and package strategies',
      'Strong enterprise and premium tier adoption',
      'Effective account expansion programs',
    ],
  },
  {
    title: 'Share of budget: customer acquisition (%)',
    value: '25% - 40%',
    threshold: '35%',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Under-investment in bottom-funnel conversion',
      'Sales enablement gaps affecting close rates',
      'Weak demand capture mechanisms',
    ],
    highExamples: [
      'Strong sales enablement and conversion focus',
      'Effective nurture and conversion programs',
      'Optimized customer journey and touchpoints',
    ],
  },
];

// Engagement & Budget Optimization KPIs
const engagementKpis = [
  {
    title: 'Staff costs as % of total marketing spend',
    value: '25% - 40%',
    threshold: '35%',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Heavy automation and agency reliance',
      'Risk of losing strategic control',
      'Potential gaps in internal capabilities',
    ],
    highExamples: [
      'Strong in-house expertise and control',
      'Higher fixed costs but greater strategic flexibility',
      'Better alignment with company objectives',
    ],
  },
  {
    title: '% of budget spent on events/webinars',
    value: '5% - 15%',
    threshold: '10%',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Under-leveraging high-impact event channels',
      'Missing relationship-building opportunities',
      'Limited face-to-face customer engagement',
    ],
    highExamples: [
      'Strong event-led marketing strategy',
      'Effective pipeline generation through events',
      'High-quality engagement and networking',
    ],
  },
  {
    title: 'Marketing spend per new customer',
    value: '$800 - $2,000',
    threshold: '$1,200',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Efficient customer acquisition strategies',
      'Strong organic and referral growth',
      'Optimized marketing and sales efficiency',
    ],
    highExamples: [
      'High acquisition costs reducing profitability',
      'Inefficient channel mix and targeting',
      'Complex sales requiring heavy investment',
    ],
  },
];

// Retention & Customer Value KPIs
const retentionKpis = [
  {
    title: 'LTV/CAC ratio',
    value: '3x - 5x',
    threshold: '4x',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Acquisition costs too high relative to customer value',
      'Limited customer retention and expansion',
      'Short customer lifecycles impacting long-term value',
    ],
    highExamples: [
      'Strong product-market fit driving retention',
      'Effective expansion and upsell strategies',
      'Low CAC with high customer lifetime value',
    ],
  },
  {
    title: 'CAC payback period (months)',
    value: '< 12 months',
    threshold: '9 months',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Quick payback enabling reinvestment',
      'Efficient capital allocation for growth',
      'Strong unit economics supporting scale',
    ],
    highExamples: [
      'Long payback periods straining cash flow',
      'High upfront costs delaying profitability',
      'Need for significant capital to fund growth',
    ],
  },
  {
    title: 'Retention vs. acquisition budget split',
    value: '20% / 80% - 30% / 70%',
    threshold: '25% / 75%',
    lowRange: '< Low $$ Drivers',
    highRange: '> High $$ Drivers',
    lowExamples: [
      'Over-focus on new acquisition vs retention',
      'Higher churn risk from customer neglect',
      'Missing expansion and upsell opportunities',
    ],
    highExamples: [
      'Strong customer success investment',
      'Balanced growth through new and existing customers',
      'Focus on lifetime value maximization',
    ],
  },
];

export default function V2Page() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSectionV2 />
        <CompanyProfileCard />
        <BusinessAssumptionsV2 />

        {/* Acquisition Section */}
        <section className="mb-12">
          <SectionTitle
            title="Acquisition"
            subtitle="Investment and cost efficiency for customer acquisition"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acquisitionKpis.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>
        </section>

        {/* Conversion & Pipeline Section */}
        <section className="mb-12">
          <SectionTitle
            title="Conversion & Pipeline"
            subtitle="Efficiency metrics for lead conversion and deal size"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversionKpis.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>
        </section>

        {/* Engagement & Budget Optimization Section */}
        <section className="mb-12">
          <SectionTitle
            title="Engagement & Budget Optimization"
            subtitle="Strategic allocation and operational efficiency"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagementKpis.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>
        </section>

        {/* Retention & Customer Value Section */}
        <section className="mb-12">
          <SectionTitle
            title="Retention & Customer Value"
            subtitle="Long-term value and customer lifecycle metrics"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retentionKpis.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>
        </section>

        <div className="bg-brevo-light border-l-4 border-brevo-green p-6 rounded-lg mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Sources & References</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-brevo-green font-bold">1</span>
              <span className="text-sm text-gray-700">
                SaaS Capital: How much do SaaS companies spend on marketing?
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brevo-green font-bold">2</span>
              <span className="text-sm text-gray-700">
                Gartner: CMO Spend Survey Results
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brevo-green font-bold">3</span>
              <span className="text-sm text-gray-700">
                Forbes: SaaS Marketing Budget Report
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brevo-green font-bold">4</span>
              <span className="text-sm text-gray-700">
                Deloitte: CMO Survey
              </span>
            </li>
          </ul>
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
