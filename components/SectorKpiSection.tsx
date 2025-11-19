import React from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';
import { KpiTable, KpiRow } from './KpiTable';

const acquisitionData: KpiRow[] = [
  {
    kpi: 'CAC (Customer Acquisition Cost)',
    low: '> €40',
    median: '€25–40',
    high: '< €25',
    position: 'Median (≈ €32 estimated)',
  },
  {
    kpi: 'Share of marketing budget in paid',
    low: '< 40%',
    median: '40–60%',
    high: '> 60%',
    position: 'Median',
  },
];

const conversionData: KpiRow[] = [
  {
    kpi: 'Site conversion rate',
    low: '< 1.5%',
    median: '1.5–2.5%',
    high: '> 2.5%',
    position: 'Median (≈ 2.1%)',
  },
  {
    kpi: 'Average Order Value (AOV)',
    low: '< €40',
    median: '€40–80',
    high: '> €80',
    position: 'Upper median (€65)',
  },
];

const engagementData: KpiRow[] = [
  {
    kpi: 'Contact activation rate (90d)',
    low: '< 35%',
    median: '35–50%',
    high: '> 50%',
    position: 'Low',
  },
  {
    kpi: 'Campaign open rate',
    low: '< 18%',
    median: '18–26%',
    high: '> 26%',
    position: 'Median',
  },
  {
    kpi: 'CRM-attributable revenue share',
    low: '< 15%',
    median: '15–30%',
    high: '> 30%',
    position: 'Low (≈ 12%)',
  },
];

const retentionData: KpiRow[] = [
  {
    kpi: 'Purchase frequency / year',
    low: '< 1.5',
    median: '1.5–2.3',
    high: '> 2.3',
    position: 'Upper median (2.1)',
  },
  {
    kpi: 'Repeat rate at 12 months',
    low: '< 25%',
    median: '25–40%',
    high: '> 40%',
    position: 'Median',
  },
  {
    kpi: 'LTV / CAC',
    low: '< 2.0',
    median: '2.0–3.0',
    high: '> 3.0',
    position: 'Low (≈ 1.8)',
  },
];

export const SectorKpiSection: React.FC = () => {
  return (
    <section className="mb-12">
      <SectionTitle
        title="Industry KPI Benchmarks"
        subtitle="The values below are benchmarks observed for similarly-sized fashion e-commerce companies. They are structured into three zones: low, median, and high."
      />

      <Card>
        <KpiTable title="Acquisition" rows={acquisitionData} />
        <KpiTable title="Site & Conversion" rows={conversionData} />
        <KpiTable title="Engagement & CRM" rows={engagementData} />
        <KpiTable title="Retention & Value" rows={retentionData} />
      </Card>
    </section>
  );
};
