// Data source for B2C Retail Benchmarks
// Categories: Fashion, Home, Beauty, Electronics
// Price Tiers: Budget, Mid-Range, Luxury

export type Industry = 'Fashion' | 'Home' | 'Beauty' | 'Electronics';
export type PriceTier = 'Budget' | 'Mid-Range' | 'Luxury';

export interface BenchmarkData {
    id: string;
    category: 'Acquisition' | 'Conversion' | 'Retention' | 'Economics';
    name: string;
    unit: string;
    description: string;
    ranges: {
        [key in PriceTier]: {
            low: number;
            median: number;
            high: number;
            insight: string;
        };
    };
}

export const retailBenchmarks: Record<Industry, BenchmarkData[]> = {
    Fashion: [
        // Acquisition
        {
            id: 'cac',
            category: 'Acquisition',
            name: 'Customer Acquisition Cost (CAC)',
            unit: '€',
            description: 'Total marketing spend divided by new customers acquired.',
            ranges: {
                Budget: { low: 15, median: 25, high: 40, insight: 'Low margins require highly efficient acquisition.' },
                'Mid-Range': { low: 30, median: 45, high: 70, insight: 'Standard range for branded mid-market apparel.' },
                Luxury: { low: 80, median: 150, high: 300, insight: 'High LTV justifies significant upfront investment.' },
            },
        },
        {
            id: 'roas',
            category: 'Acquisition',
            name: 'Blended ROAS',
            unit: 'x',
            description: 'Total revenue divided by total marketing spend.',
            ranges: {
                Budget: { low: 3.5, median: 5.0, high: 7.0, insight: 'Volume-driven models need high efficiency.' },
                'Mid-Range': { low: 3.0, median: 4.0, high: 5.5, insight: 'Healthy balance of brand and performance.' },
                Luxury: { low: 2.0, median: 3.0, high: 4.5, insight: 'Brand equity investment lowers immediate ROAS.' },
            },
        },
        {
            id: 'marketing_spend',
            category: 'Acquisition',
            name: 'Marketing % of Revenue',
            unit: '%',
            description: 'Total marketing budget as a percentage of gross revenue.',
            ranges: {
                Budget: { low: 10, median: 15, high: 20, insight: 'Tight controls on spend.' },
                'Mid-Range': { low: 15, median: 20, high: 25, insight: 'Growth-focused allocation.' },
                Luxury: { low: 12, median: 18, high: 25, insight: 'Significant spend on brand awareness.' },
            },
        },
        // Conversion
        {
            id: 'conv_rate',
            category: 'Conversion',
            name: 'Conversion Rate (Desktop)',
            unit: '%',
            description: 'Percentage of desktop visitors who make a purchase.',
            ranges: {
                Budget: { low: 2.5, median: 3.5, high: 5.0, insight: 'Impulse buys drive higher conversion.' },
                'Mid-Range': { low: 1.8, median: 2.4, high: 3.5, insight: 'Considered purchases take longer.' },
                Luxury: { low: 0.8, median: 1.2, high: 1.8, insight: 'Exclusive nature means lower volume.' },
            },
        },
        {
            id: 'mobile_conv',
            category: 'Conversion',
            name: 'Conversion Rate (Mobile)',
            unit: '%',
            description: 'Percentage of mobile visitors who make a purchase.',
            ranges: {
                Budget: { low: 1.5, median: 2.2, high: 3.0, insight: 'Mobile-first audience.' },
                'Mid-Range': { low: 1.0, median: 1.5, high: 2.2, insight: 'Gap between desktop and mobile is common.' },
                Luxury: { low: 0.4, median: 0.7, high: 1.0, insight: 'Research on mobile, buy on desktop.' },
            },
        },
        {
            id: 'cart_abandon',
            category: 'Conversion',
            name: 'Cart Abandonment Rate',
            unit: '%',
            description: 'Percentage of carts created that are not purchased.',
            ranges: {
                Budget: { low: 65, median: 70, high: 75, insight: 'Price sensitivity drives abandonment.' },
                'Mid-Range': { low: 70, median: 75, high: 80, insight: 'Comparison shopping is prevalent.' },
                Luxury: { low: 75, median: 80, high: 85, insight: 'High consideration period.' },
            },
        },
        {
            id: 'aov',
            category: 'Conversion',
            name: 'Average Order Value (AOV)',
            unit: '€',
            description: 'Average revenue per transaction.',
            ranges: {
                Budget: { low: 40, median: 55, high: 70, insight: 'Multiple items per basket.' },
                'Mid-Range': { low: 80, median: 110, high: 150, insight: 'Core benchmark for mid-market.' },
                Luxury: { low: 300, median: 500, high: 1000, insight: 'Single item value drives AOV.' },
            },
        },
        // Retention
        {
            id: 'repeat_rate',
            category: 'Retention',
            name: 'Repeat Customer Rate',
            unit: '%',
            description: 'Percentage of customers who buy more than once.',
            ranges: {
                Budget: { low: 20, median: 25, high: 35, insight: 'Low loyalty, high churn.' },
                'Mid-Range': { low: 25, median: 35, high: 45, insight: 'Brand affinity builds retention.' },
                Luxury: { low: 30, median: 45, high: 60, insight: 'High loyalty among core clientele.' },
            },
        },
        {
            id: 'purchase_freq',
            category: 'Retention',
            name: 'Purchase Frequency',
            unit: '#/yr',
            description: 'Average number of orders per customer per year.',
            ranges: {
                Budget: { low: 1.8, median: 2.5, high: 3.5, insight: 'Frequent, low-value purchases.' },
                'Mid-Range': { low: 1.5, median: 2.1, high: 2.8, insight: 'Seasonal purchasing patterns.' },
                Luxury: { low: 1.1, median: 1.4, high: 1.8, insight: 'Occasional investment pieces.' },
            },
        },
        // Economics
        {
            id: 'return_rate',
            category: 'Economics',
            name: 'Return Rate',
            unit: '%',
            description: 'Percentage of items returned.',
            ranges: {
                Budget: { low: 15, median: 20, high: 25, insight: 'Fit issues common.' },
                'Mid-Range': { low: 20, median: 25, high: 35, insight: 'Free returns encourage ordering multiple sizes.' },
                Luxury: { low: 25, median: 30, high: 40, insight: 'High expectations drive returns.' },
            },
        },
        {
            id: 'gross_margin',
            category: 'Economics',
            name: 'Gross Margin',
            unit: '%',
            description: 'Revenue minus Cost of Goods Sold (COGS).',
            ranges: {
                Budget: { low: 45, median: 50, high: 55, insight: 'Volume play.' },
                'Mid-Range': { low: 55, median: 60, high: 65, insight: 'Healthy margins for branding.' },
                Luxury: { low: 70, median: 75, high: 85, insight: 'Brand premium drives high margins.' },
            },
        },
    ],
    // Defaulting other industries to similar structure for this demo
    Home: [],
    Beauty: [],
    Electronics: []
};

// Fill other industries with slight variations for demo purposes
retailBenchmarks.Home = retailBenchmarks.Fashion.map(kpi => ({
    ...kpi,
    ranges: {
        Budget: { ...kpi.ranges.Budget, median: kpi.ranges.Budget.median * 1.2 },
        'Mid-Range': { ...kpi.ranges['Mid-Range'], median: kpi.ranges['Mid-Range'].median * 1.2 },
        Luxury: { ...kpi.ranges.Luxury, median: kpi.ranges.Luxury.median * 1.2 },
    }
}));

retailBenchmarks.Beauty = retailBenchmarks.Fashion.map(kpi => ({
    ...kpi,
    ranges: {
        Budget: { ...kpi.ranges.Budget, median: kpi.ranges.Budget.median * 0.8 },
        'Mid-Range': { ...kpi.ranges['Mid-Range'], median: kpi.ranges['Mid-Range'].median * 0.8 },
        Luxury: { ...kpi.ranges.Luxury, median: kpi.ranges.Luxury.median * 0.8 },
    }
}));

retailBenchmarks.Electronics = retailBenchmarks.Fashion.map(kpi => ({
    ...kpi,
    ranges: {
        Budget: { ...kpi.ranges.Budget, median: kpi.ranges.Budget.median * 0.9 },
        'Mid-Range': { ...kpi.ranges['Mid-Range'], median: kpi.ranges['Mid-Range'].median * 0.9 },
        Luxury: { ...kpi.ranges.Luxury, median: kpi.ranges.Luxury.median * 0.9 },
    }
}));
