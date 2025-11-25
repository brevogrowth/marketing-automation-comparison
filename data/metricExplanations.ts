/**
 * Detailed explanations for each KPI metric
 * Used in the "Why this metric?" toggle in BenchmarkGrid
 */

export interface MetricExplanation {
    definition: string;
    importance: string;
    bestPractices: string[];
    formula?: string;
}

export const metricExplanations: Record<string, MetricExplanation> = {
    // Strategic Efficiency
    ltv_cac: {
        definition: "The LTV:CAC ratio compares the lifetime value of a customer (total revenue they generate over their relationship with you) to the cost of acquiring them.",
        importance: "This is arguably the most critical metric for sustainable growth. A ratio below 3:1 suggests you're spending too much to acquire customers who don't generate enough value. Above 5:1 might indicate you're under-investing in growth.",
        bestPractices: [
            "Track cohort-based LTV, not just averages",
            "Include all acquisition costs (ads, content, sales)",
            "Segment by channel to identify best-performing sources",
            "Consider payback period alongside ratio"
        ],
        formula: "LTV ÷ CAC"
    },
    mer: {
        definition: "Marketing Efficiency Ratio measures total revenue generated per euro spent on marketing, including both paid and organic channels.",
        importance: "Unlike ROAS which focuses on specific campaigns, MER gives you the full picture of marketing efficiency. It helps identify when organic channels are compensating for underperforming paid ones.",
        bestPractices: [
            "Track MER alongside individual channel ROAS",
            "Set MER targets based on your gross margin",
            "Watch for MER declines as you scale (normal but must be managed)",
            "Use MER to validate blended strategy effectiveness"
        ],
        formula: "Total Revenue ÷ Total Marketing Spend"
    },

    // Acquisition
    cac: {
        definition: "Customer Acquisition Cost represents the total cost to acquire one new customer, including all marketing and sales expenses.",
        importance: "CAC directly impacts profitability and determines how fast you can scale. Rising CAC is often the first sign of market saturation or inefficient spend allocation.",
        bestPractices: [
            "Calculate CAC by channel and campaign type",
            "Include often-forgotten costs (tools, agency fees, creative)",
            "Compare CAC trends month-over-month",
            "Correlate CAC changes with market conditions"
        ],
        formula: "Total Marketing & Sales Costs ÷ New Customers Acquired"
    },
    roas: {
        definition: "Return on Ad Spend measures the revenue generated for every euro invested in advertising campaigns.",
        importance: "ROAS helps evaluate campaign-level performance and guides budget allocation. However, it doesn't account for customer lifetime value or organic lift from brand awareness.",
        bestPractices: [
            "Set different ROAS targets by campaign objective (brand vs. performance)",
            "Account for attribution windows and model limitations",
            "Don't chase ROAS at the expense of scale",
            "Compare platform-reported vs. actual tracked ROAS"
        ],
        formula: "Revenue from Ads ÷ Ad Spend"
    },
    marketing_spend: {
        definition: "The percentage of total revenue allocated to marketing activities, including paid media, content, tools, and team costs.",
        importance: "This ratio helps benchmark your investment level against industry standards and indicates growth stage maturity. Early-stage companies typically spend more; mature ones optimize for efficiency.",
        bestPractices: [
            "Adjust targets based on growth objectives",
            "Include all marketing costs, not just media",
            "Track the mix between brand and performance spend",
            "Plan for seasonal variations in spend ratio"
        ],
        formula: "Total Marketing Budget ÷ Gross Revenue × 100"
    },

    // Conversion
    conv_rate: {
        definition: "The percentage of desktop website visitors who complete a purchase during their session.",
        importance: "Conversion rate is your efficiency multiplier - even small improvements create significant revenue impact. Desktop typically converts higher than mobile due to easier comparison shopping.",
        bestPractices: [
            "Segment by traffic source (paid vs. organic converts differently)",
            "A/B test checkout flow continuously",
            "Monitor micro-conversions (add to cart, checkout start)",
            "Don't optimize for CVR at the expense of traffic quality"
        ],
        formula: "Desktop Purchases ÷ Desktop Visitors × 100"
    },
    mobile_conv: {
        definition: "The percentage of mobile website visitors who complete a purchase during their session.",
        importance: "With 60-70% of traffic now mobile, this metric increasingly determines overall performance. Mobile conversion is typically 30-50% lower than desktop but improving rapidly.",
        bestPractices: [
            "Optimize for thumb-friendly navigation",
            "Implement mobile payment options (Apple Pay, Google Pay)",
            "Reduce form fields and use autofill",
            "Test page speed - every second costs conversions"
        ],
        formula: "Mobile Purchases ÷ Mobile Visitors × 100"
    },
    cart_abandon: {
        definition: "The percentage of shopping carts that are created but not converted into purchases.",
        importance: "Cart abandonment represents your biggest conversion opportunity - these visitors showed clear purchase intent. Industry average is 70-80%, but even small reductions drive significant revenue.",
        bestPractices: [
            "Implement abandoned cart email sequences (ideally 3-part)",
            "Be transparent about shipping costs early",
            "Offer guest checkout",
            "Test exit-intent offers carefully"
        ],
        formula: "(Carts Created - Completed Purchases) ÷ Carts Created × 100"
    },
    aov: {
        definition: "Average Order Value is the mean revenue per transaction across all orders.",
        importance: "AOV directly impacts profitability - higher AOV often means better unit economics. It's usually easier to increase AOV from existing customers than to acquire new ones.",
        bestPractices: [
            "Use strategic free shipping thresholds",
            "Implement product bundles and kits",
            "Show 'frequently bought together' recommendations",
            "Test upsells at checkout (carefully)"
        ],
        formula: "Total Revenue ÷ Number of Orders"
    },

    // Channel Mix
    email_rev_share: {
        definition: "The percentage of total revenue attributed to email marketing campaigns and automations.",
        importance: "Email is typically your highest-ROI channel with near-zero marginal cost. Strong email revenue share indicates healthy owned audience engagement and reduced dependency on paid acquisition.",
        bestPractices: [
            "Balance promotional vs. value-add content",
            "Segment lists for relevance",
            "Automate lifecycle emails (welcome, post-purchase, win-back)",
            "Monitor deliverability and engagement metrics"
        ],
        formula: "Email-Attributed Revenue ÷ Total Revenue × 100"
    },
    sms_rev_share: {
        definition: "The percentage of total revenue attributed to SMS marketing campaigns.",
        importance: "SMS has 98% open rates vs. 20% for email. It's ideal for time-sensitive offers and high-intent moments, but requires careful frequency management to avoid opt-outs.",
        bestPractices: [
            "Reserve SMS for high-value, time-sensitive messages",
            "Keep messages short and action-oriented",
            "Respect frequency (1-4 messages/month max)",
            "Use for transactional updates and flash sales"
        ],
        formula: "SMS-Attributed Revenue ÷ Total Revenue × 100"
    },

    // Retention
    repeat_rate: {
        definition: "The percentage of customers who make more than one purchase within a defined period (typically 12 months).",
        importance: "Repeat customers are 5-25x cheaper to convert than new ones and typically have higher AOV. This metric is the foundation of sustainable, profitable growth.",
        bestPractices: [
            "Implement a post-purchase email sequence",
            "Create loyalty or rewards programs",
            "Personalize recommendations based on purchase history",
            "Track time-to-second-purchase to optimize timing"
        ],
        formula: "Customers with 2+ Orders ÷ Total Customers × 100"
    },
    purchase_freq: {
        definition: "The average number of orders placed per customer over a 12-month period.",
        importance: "Frequency directly multiplies LTV. Understanding your natural purchase cycle helps time marketing touchpoints and identify at-risk customers before they churn.",
        bestPractices: [
            "Map your product's natural replenishment cycle",
            "Implement subscription or auto-replenishment options",
            "Create new purchase occasions (gifts, seasonal)",
            "Trigger re-engagement at optimal intervals"
        ],
        formula: "Total Orders ÷ Unique Customers (12-month period)"
    },
    churn_rate: {
        definition: "The percentage of customers who do not make a repeat purchase within 12 months of their last order.",
        importance: "Churn is the silent killer of growth - you might be acquiring customers fast while losing them faster. Reducing churn often has higher ROI than increasing acquisition.",
        bestPractices: [
            "Identify at-risk customers before they churn (RFM analysis)",
            "Implement win-back campaigns",
            "Survey churned customers to understand why",
            "Calculate cost of churn vs. cost of retention"
        ],
        formula: "Customers Not Returning in 12 Months ÷ Total Active Customers × 100"
    },

    // Economics
    return_rate: {
        definition: "The percentage of sold items that are returned by customers.",
        importance: "Returns directly eat into margin and create operational costs. High returns often signal sizing/fit issues, poor product descriptions, or quality problems.",
        bestPractices: [
            "Improve product descriptions and sizing guides",
            "Add more product photos and videos",
            "Analyze return reasons by category",
            "Consider virtual try-on or AR tools"
        ],
        formula: "Items Returned ÷ Items Sold × 100"
    },
    gross_margin: {
        definition: "The percentage of revenue remaining after subtracting the direct cost of goods sold (COGS).",
        importance: "Gross margin sets the ceiling for all other spending - marketing, operations, profit. Low margin businesses need higher volume and efficiency to survive.",
        bestPractices: [
            "Negotiate with suppliers as you scale",
            "Analyze margin by product category",
            "Consider private label for margin improvement",
            "Don't sacrifice margin for revenue growth"
        ],
        formula: "(Revenue - COGS) ÷ Revenue × 100"
    },

    // B2B Specific Metrics
    win_rate: {
        definition: "The percentage of qualified opportunities that result in closed deals.",
        importance: "Win rate reveals sales effectiveness and competitive positioning. Low win rates indicate either poor lead qualification or competitive/pricing issues.",
        bestPractices: [
            "Track win rate by lead source and salesperson",
            "Analyze lost deal reasons systematically",
            "Improve qualification criteria to focus on best-fit prospects",
            "Invest in sales enablement and competitive intelligence"
        ],
        formula: "Won Deals ÷ Total Qualified Opportunities × 100"
    },
    deal_cycle: {
        definition: "The average number of days from first contact to closed deal.",
        importance: "Cycle length impacts cash flow and forecast accuracy. Longer cycles require more nurturing investment but often yield larger deals.",
        bestPractices: [
            "Map your buyer's journey to identify bottlenecks",
            "Create content for each decision stage",
            "Implement lead scoring to prioritize ready buyers",
            "Track cycle by deal size (larger deals naturally take longer)"
        ],
        formula: "Sum of Days to Close ÷ Number of Deals"
    },
    lead_conv: {
        definition: "The percentage of qualified leads that convert to opportunities or customers.",
        importance: "Lead conversion efficiency determines how much you can afford to pay for leads. Low conversion often indicates poor targeting or nurturing gaps.",
        bestPractices: [
            "Define clear SQL criteria with sales alignment",
            "Implement lead scoring based on behavior",
            "Create targeted nurture sequences",
            "Analyze conversion by source and persona"
        ],
        formula: "Converted Leads ÷ Total Qualified Leads × 100"
    },
    nrr: {
        definition: "Net Revenue Retention measures revenue from existing customers including expansion, contraction, and churn.",
        importance: "NRR above 100% means you grow even without new customers. It's the strongest indicator of product-market fit and customer satisfaction.",
        bestPractices: [
            "Track expansion revenue (upsells, cross-sells)",
            "Monitor early warning signs of contraction",
            "Invest in customer success proactively",
            "Identify expansion triggers and replicate them"
        ],
        formula: "(Start MRR + Expansion - Contraction - Churn) ÷ Start MRR × 100"
    },
    sql_rate: {
        definition: "The percentage of marketing qualified leads that become sales qualified leads.",
        importance: "SQL rate measures marketing-sales alignment and lead quality. Low rates create tension between teams and waste resources.",
        bestPractices: [
            "Align on MQL and SQL definitions with sales",
            "Implement feedback loops from sales to marketing",
            "Review and update qualification criteria quarterly",
            "Track speed-to-follow-up on MQLs"
        ],
        formula: "SQLs Generated ÷ MQLs Generated × 100"
    },
    cpl: {
        definition: "Cost Per Lead measures the average investment required to generate one qualified lead.",
        importance: "CPL helps evaluate channel efficiency for lead generation. Unlike CAC, it focuses on top-of-funnel effectiveness.",
        bestPractices: [
            "Calculate CPL by channel and campaign",
            "Weight CPL by lead quality score",
            "Compare CPL trends over time",
            "Balance CPL against lead quality"
        ],
        formula: "Marketing Spend ÷ Leads Generated"
    },
    arpc: {
        definition: "Average Revenue Per Customer measures the typical annual revenue generated per customer.",
        importance: "ARPC helps with segmentation and identifies expansion opportunities. Growing ARPC is often easier than acquiring new customers.",
        bestPractices: [
            "Segment customers by ARPC tier",
            "Identify characteristics of high-ARPC customers",
            "Create upsell paths for each segment",
            "Track ARPC trends over customer lifecycle"
        ],
        formula: "Total Annual Revenue ÷ Total Customers"
    }
};
