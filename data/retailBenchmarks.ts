// Auto-generated from benchmarks.csv
// DO NOT EDIT MANUALLY - Run 'npm run generate:benchmarks' to update

export type Industry = 'Fashion' | 'Home';
export type PriceTier = 'Budget' | 'Mid-Range' | 'Luxury';

export interface BenchmarkData {
    id: string;
    category: 'Strategic Efficiency' | 'Acquisition' | 'Conversion' | 'Channel Mix' | 'Retention' | 'Economics';
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
        {
            id: 'cac',
            category: 'Acquisition',
            name: 'Customer Acquisition Cost (CAC)',
            unit: '€',
            description: 'Total marketing spend divided by new customers acquired.',
            ranges: {
                'Budget': { low: 20, median: 40, high: 60, insight: 'Low margins require highly efficient acquisition.' },
                'Mid-Range': { low: 30, median: 45, high: 70, insight: 'Standard range for branded mid-market apparel.' },
                'Luxury': { low: 80, median: 150, high: 300, insight: 'High LTV justifies significant upfront investment.' },
            },
        },
        {
            id: 'roas',
            category: 'Acquisition',
            name: 'Blended ROAS',
            unit: 'x',
            description: 'Total revenue divided by total marketing spend.',
            ranges: {
                'Budget': { low: 3.5, median: 5, high: 7, insight: 'Volume-driven models need high efficiency.' },
                'Mid-Range': { low: 3, median: 4, high: 5.5, insight: 'Healthy balance of brand and performance.' },
                'Luxury': { low: 2, median: 3, high: 4.5, insight: 'Brand equity investment lowers immediate ROAS.' },
            },
        },
        {
            id: 'marketing_spend',
            category: 'Acquisition',
            name: 'Marketing % of Revenue',
            unit: '%',
            description: 'Total marketing budget as a percentage of gross revenue.',
            ranges: {
                'Budget': { low: 10, median: 15, high: 20, insight: 'Tight controls on spend.' },
                'Mid-Range': { low: 15, median: 20, high: 25, insight: 'Growth-focused allocation.' },
                'Luxury': { low: 12, median: 18, high: 25, insight: 'Significant spend on brand awareness.' },
            },
        },
        {
            id: 'conv_rate',
            category: 'Conversion',
            name: 'Conversion Rate (Desktop)',
            unit: '%',
            description: 'Percentage of desktop visitors who make a purchase.',
            ranges: {
                'Budget': { low: 2.5, median: 3.5, high: 5, insight: 'Impulse buys drive higher conversion.' },
                'Mid-Range': { low: 1.8, median: 2.4, high: 3.5, insight: 'Considered purchases take longer.' },
                'Luxury': { low: 0.8, median: 1.2, high: 1.8, insight: 'Exclusive nature means lower volume.' },
            },
        },
        {
            id: 'mobile_conv',
            category: 'Conversion',
            name: 'Conversion Rate (Mobile)',
            unit: '%',
            description: 'Percentage of mobile visitors who make a purchase.',
            ranges: {
                'Budget': { low: 1.5, median: 2.2, high: 3, insight: 'Mobile-first audience.' },
                'Mid-Range': { low: 1, median: 1.5, high: 2.2, insight: 'Gap between desktop and mobile is common.' },
                'Luxury': { low: 0.4, median: 0.7, high: 1, insight: 'Research on mobile; buy on desktop.' },
            },
        },
        {
            id: 'cart_abandon',
            category: 'Conversion',
            name: 'Cart Abandonment Rate',
            unit: '%',
            description: 'Percentage of carts created that are not purchased.',
            ranges: {
                'Budget': { low: 65, median: 70, high: 75, insight: 'Price sensitivity drives abandonment.' },
                'Mid-Range': { low: 70, median: 75, high: 80, insight: 'Comparison shopping is prevalent.' },
                'Luxury': { low: 75, median: 80, high: 85, insight: 'High consideration period.' },
            },
        },
        {
            id: 'aov',
            category: 'Conversion',
            name: 'Average Order Value (AOV)',
            unit: '€',
            description: 'Average revenue per transaction.',
            ranges: {
                'Budget': { low: 40, median: 55, high: 70, insight: 'Multiple items per basket.' },
                'Mid-Range': { low: 80, median: 110, high: 150, insight: 'Core benchmark for mid-market.' },
                'Luxury': { low: 300, median: 500, high: 1000, insight: 'Single item value drives AOV.' },
            },
        },
        {
            id: 'repeat_rate',
            category: 'Retention',
            name: 'Repeat Customer Rate',
            unit: '%',
            description: 'Percentage of customers who buy more than once.',
            ranges: {
                'Budget': { low: 20, median: 25, high: 35, insight: 'Low loyalty; high churn.' },
                'Mid-Range': { low: 25, median: 35, high: 45, insight: 'Brand affinity builds retention.' },
                'Luxury': { low: 30, median: 45, high: 60, insight: 'High loyalty among core clientele.' },
            },
        },
        {
            id: 'purchase_freq',
            category: 'Retention',
            name: 'Purchase Frequency',
            unit: '#/yr',
            description: 'Average number of orders per customer per year.',
            ranges: {
                'Budget': { low: 1.8, median: 2.5, high: 3.5, insight: 'Frequent low-value purchases.' },
                'Mid-Range': { low: 1.5, median: 2.1, high: 2.8, insight: 'Seasonal purchasing patterns.' },
                'Luxury': { low: 1.1, median: 1.4, high: 1.8, insight: 'Occasional investment pieces.' },
            },
        },
        {
            id: 'return_rate',
            category: 'Economics',
            name: 'Return Rate',
            unit: '%',
            description: 'Percentage of items returned.',
            ranges: {
                'Budget': { low: 15, median: 20, high: 25, insight: 'Fit issues common.' },
                'Mid-Range': { low: 20, median: 25, high: 35, insight: 'Free returns encourage ordering multiple sizes.' },
                'Luxury': { low: 25, median: 30, high: 40, insight: 'High expectations drive returns.' },
            },
        },
        {
            id: 'gross_margin',
            category: 'Economics',
            name: 'Gross Margin',
            unit: '%',
            description: 'Revenue minus Cost of Goods Sold (COGS).',
            ranges: {
                'Budget': { low: 45, median: 50, high: 55, insight: 'Volume play.' },
                'Mid-Range': { low: 55, median: 60, high: 65, insight: 'Healthy margins for branding.' },
                'Luxury': { low: 70, median: 75, high: 85, insight: 'Brand premium drives high margins.' },
            },
        },
        {
            id: 'ltv_cac',
            category: 'Strategic Efficiency',
            name: 'LTV:CAC Ratio',
            unit: 'x',
            description: 'Lifetime Value divided by Customer Acquisition Cost.',
            ranges: {
                'Budget': { low: 2.5, median: 3.5, high: 5, insight: 'High volume requires strong unit economics.' },
                'Mid-Range': { low: 3, median: 4, high: 6, insight: 'Healthy growth engine.' },
                'Luxury': { low: 3.5, median: 5, high: 8, insight: 'Exceptional brand value drives high ratios.' },
            },
        },
        {
            id: 'mer',
            category: 'Strategic Efficiency',
            name: 'Marketing Efficiency Ratio (MER)',
            unit: 'x',
            description: 'Total Revenue / Total Marketing Spend.',
            ranges: {
                'Budget': { low: 4, median: 6, high: 9, insight: 'Must be high to sustain low margins.' },
                'Mid-Range': { low: 3.5, median: 5, high: 7, insight: 'Balanced growth and profitability.' },
                'Luxury': { low: 2.5, median: 4, high: 6, insight: 'Brand building investment lowers short-term MER.' },
            },
        },
        {
            id: 'email_rev_share',
            category: 'Channel Mix',
            name: 'Email Revenue Share',
            unit: '%',
            description: 'Percentage of total revenue attributed to Email Marketing.',
            ranges: {
                'Budget': { low: 15, median: 20, high: 30, insight: 'Critical for low-cost retention.' },
                'Mid-Range': { low: 20, median: 25, high: 35, insight: 'The backbone of profitable growth.' },
                'Luxury': { low: 10, median: 15, high: 25, insight: 'Personalized clienteling drives this.' },
            },
        },
        {
            id: 'sms_rev_share',
            category: 'Channel Mix',
            name: 'SMS Revenue Share',
            unit: '%',
            description: 'Percentage of total revenue attributed to SMS Marketing.',
            ranges: {
                'Budget': { low: 2, median: 5, high: 10, insight: 'High impact for flash sales.' },
                'Mid-Range': { low: 3, median: 7, high: 12, insight: 'Growing channel for engagement.' },
                'Luxury': { low: 1, median: 3, high: 5, insight: 'Used sparingly for VIP service.' },
            },
        },
        {
            id: 'churn_rate',
            category: 'Retention',
            name: 'Annual Churn Rate',
            unit: '%',
            description: 'Percentage of customers who do not return within 12 months.',
            ranges: {
                'Budget': { low: 60, median: 70, high: 80, insight: 'High churn is typical; focus on acquisition volume.' },
                'Mid-Range': { low: 40, median: 50, high: 60, insight: 'Retention is key to profitability.' },
                'Luxury': { low: 20, median: 30, high: 40, insight: 'Client relationships reduce churn significantly.' },
            },
        }
    ],
    Home: [
        {
            id: 'cac',
            category: 'Acquisition',
            name: 'Customer Acquisition Cost (CAC)',
            unit: '€',
            description: 'Total marketing spend divided by new customers acquired.',
            ranges: {
                'Budget': { low: 20, median: 35, high: 55, insight: 'Lower frequency purchases increase acquisition cost.' },
                'Mid-Range': { low: 45, median: 65, high: 95, insight: 'Considered purchases require more touchpoints.' },
                'Luxury': { low: 120, median: 220, high: 400, insight: 'Premium positioning demands high-touch marketing.' },
            },
        },
        {
            id: 'roas',
            category: 'Acquisition',
            name: 'Blended ROAS',
            unit: 'x',
            description: 'Total revenue divided by total marketing spend.',
            ranges: {
                'Budget': { low: 3, median: 4.5, high: 6.5, insight: 'Seasonal peaks boost efficiency.' },
                'Mid-Range': { low: 2.5, median: 3.5, high: 5, insight: 'Longer sales cycles reduce immediate ROAS.' },
                'Luxury': { low: 1.8, median: 2.5, high: 4, insight: 'Brand and showroom investment lowers digital ROAS.' },
            },
        },
        {
            id: 'marketing_spend',
            category: 'Acquisition',
            name: 'Marketing % of Revenue',
            unit: '%',
            description: 'Total marketing budget as a percentage of gross revenue.',
            ranges: {
                'Budget': { low: 12, median: 18, high: 25, insight: 'Competitive market requires sustained presence.' },
                'Mid-Range': { low: 18, median: 24, high: 30, insight: 'Lifestyle positioning drives higher spend.' },
                'Luxury': { low: 15, median: 22, high: 30, insight: 'Showroom and brand experience investment.' },
            },
        },
        {
            id: 'conv_rate',
            category: 'Conversion',
            name: 'Conversion Rate (Desktop)',
            unit: '%',
            description: 'Percentage of desktop visitors who make a purchase.',
            ranges: {
                'Budget': { low: 1.8, median: 2.8, high: 4.2, insight: 'Research phase leads to moderate conversion.' },
                'Mid-Range': { low: 1.2, median: 1.8, high: 2.8, insight: 'High consideration category.' },
                'Luxury': { low: 0.5, median: 0.9, high: 1.4, insight: 'Showroom visits and consultations lower online conversion.' },
            },
        },
        {
            id: 'mobile_conv',
            category: 'Conversion',
            name: 'Conversion Rate (Mobile)',
            unit: '%',
            description: 'Percentage of mobile visitors who make a purchase.',
            ranges: {
                'Budget': { low: 1, median: 1.6, high: 2.4, insight: 'Mobile for inspiration; desktop for purchase.' },
                'Mid-Range': { low: 0.7, median: 1.2, high: 1.8, insight: 'Tablet and desktop preferred for larger purchases.' },
                'Luxury': { low: 0.3, median: 0.5, high: 0.8, insight: 'Desktop dominates luxury home purchases.' },
            },
        },
        {
            id: 'cart_abandon',
            category: 'Conversion',
            name: 'Cart Abandonment Rate',
            unit: '%',
            description: 'Percentage of carts created that are not purchased.',
            ranges: {
                'Budget': { low: 68, median: 73, high: 78, insight: 'Shipping costs major barrier.' },
                'Mid-Range': { low: 73, median: 78, high: 83, insight: 'Extended consideration period.' },
                'Luxury': { low: 78, median: 83, high: 88, insight: 'Consultation and customization needs.' },
            },
        },
        {
            id: 'aov',
            category: 'Conversion',
            name: 'Average Order Value (AOV)',
            unit: '€',
            description: 'Average revenue per transaction.',
            ranges: {
                'Budget': { low: 65, median: 85, high: 110, insight: 'Room refresh purchases.' },
                'Mid-Range': { low: 130, median: 170, high: 230, insight: 'Coordinated home styling.' },
                'Luxury': { low: 450, median: 750, high: 1500, insight: 'Statement pieces and collections.' },
            },
        },
        {
            id: 'repeat_rate',
            category: 'Retention',
            name: 'Repeat Customer Rate',
            unit: '%',
            description: 'Percentage of customers who buy more than once.',
            ranges: {
                'Budget': { low: 15, median: 20, high: 28, insight: 'Infrequent category need.' },
                'Mid-Range': { low: 20, median: 28, high: 38, insight: 'Room-by-room purchasing builds loyalty.' },
                'Luxury': { low: 25, median: 38, high: 50, insight: 'Collection building drives repeat purchases.' },
            },
        },
        {
            id: 'purchase_freq',
            category: 'Retention',
            name: 'Purchase Frequency',
            unit: '#/yr',
            description: 'Average number of orders per customer per year.',
            ranges: {
                'Budget': { low: 1.2, median: 1.8, high: 2.6, insight: 'Seasonal and need-based purchases.' },
                'Mid-Range': { low: 1, median: 1.5, high: 2.2, insight: 'Project-based purchasing.' },
                'Luxury': { low: 0.8, median: 1.1, high: 1.5, insight: 'Occasional investment pieces.' },
            },
        },
        {
            id: 'return_rate',
            category: 'Economics',
            name: 'Return Rate',
            unit: '%',
            description: 'Percentage of items returned.',
            ranges: {
                'Budget': { low: 12, median: 16, high: 22, insight: 'Size and fit less critical.' },
                'Mid-Range': { low: 16, median: 22, high: 30, insight: 'Color and material expectations.' },
                'Luxury': { low: 20, median: 26, high: 35, insight: 'High expectations for quality and finish.' },
            },
        },
        {
            id: 'gross_margin',
            category: 'Economics',
            name: 'Gross Margin',
            unit: '%',
            description: 'Revenue minus Cost of Goods Sold (COGS).',
            ranges: {
                'Budget': { low: 40, median: 46, high: 52, insight: 'Competitive pricing pressure.' },
                'Mid-Range': { low: 50, median: 56, high: 62, insight: 'Design and curation add value.' },
                'Luxury': { low: 65, median: 72, high: 82, insight: 'Brand and craftsmanship premium.' },
            },
        },
        {
            id: 'ltv_cac',
            category: 'Strategic Efficiency',
            name: 'LTV:CAC Ratio',
            unit: 'x',
            description: 'Lifetime Value divided by Customer Acquisition Cost.',
            ranges: {
                'Budget': { low: 2, median: 3, high: 4.5, insight: 'Lower frequency requires efficiency.' },
                'Mid-Range': { low: 2.5, median: 3.5, high: 5.5, insight: 'Room completion drives LTV.' },
                'Luxury': { low: 3, median: 4.5, high: 7.5, insight: 'Collection building creates long-term value.' },
            },
        },
        {
            id: 'mer',
            category: 'Strategic Efficiency',
            name: 'Marketing Efficiency Ratio (MER)',
            unit: 'x',
            description: 'Total Revenue / Total Marketing Spend.',
            ranges: {
                'Budget': { low: 3.5, median: 5.5, high: 8.5, insight: 'Seasonal efficiency critical.' },
                'Mid-Range': { low: 3, median: 4.5, high: 6.5, insight: 'Balanced brand and performance.' },
                'Luxury': { low: 2.2, median: 3.5, high: 5.5, insight: 'Showroom and experience investment.' },
            },
        },
        {
            id: 'email_rev_share',
            category: 'Channel Mix',
            name: 'Email Revenue Share',
            unit: '%',
            description: 'Percentage of total revenue attributed to Email Marketing.',
            ranges: {
                'Budget': { low: 18, median: 24, high: 35, insight: 'Promotional focus drives email.' },
                'Mid-Range': { low: 22, median: 28, high: 40, insight: 'Inspiration and seasonal campaigns.' },
                'Luxury': { low: 12, median: 18, high: 28, insight: 'Personalized curation and launches.' },
            },
        },
        {
            id: 'sms_rev_share',
            category: 'Channel Mix',
            name: 'SMS Revenue Share',
            unit: '%',
            description: 'Percentage of total revenue attributed to SMS Marketing.',
            ranges: {
                'Budget': { low: 1, median: 3, high: 8, insight: 'Flash sales and clearance.' },
                'Mid-Range': { low: 2, median: 5, high: 10, insight: 'New arrivals and limited editions.' },
                'Luxury': { low: 1, median: 2, high: 4, insight: 'VIP previews only.' },
            },
        },
        {
            id: 'churn_rate',
            category: 'Retention',
            name: 'Annual Churn Rate',
            unit: '%',
            description: 'Percentage of customers who do not return within 12 months.',
            ranges: {
                'Budget': { low: 65, median: 75, high: 85, insight: 'Infrequent need drives high churn.' },
                'Mid-Range': { low: 50, median: 60, high: 70, insight: 'Project completion reduces return rate.' },
                'Luxury': { low: 30, median: 40, high: 50, insight: 'Relationship building reduces churn.' },
            },
        }
    ]
};
