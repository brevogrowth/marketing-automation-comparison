import { BenchmarkData, PriceTier } from '@/data/benchmarks';

export type BenchmarkStatus = 'good' | 'bad' | 'neutral';

export const getBenchmarkStatus = (
    kpi: BenchmarkData,
    userVal: string,
    priceTier: PriceTier
): BenchmarkStatus => {
    if (!userVal) return 'neutral';
    const val = parseFloat(userVal);
    if (isNaN(val)) return 'neutral';

    const range = kpi.ranges[priceTier];

    // Logic depends on KPI type (higher is better vs lower is better)
    const lowerIsBetter = ['cac', 'cac_payback', 'return_rate', 'cart_abandon', 'marketing_spend', 'churn_rate', 'email_unsub_rate', 'email_bounce_rate'].includes(kpi.id);

    if (lowerIsBetter) {
        if (val <= range.low) return 'good';
        if (val >= range.high) return 'bad';
        return 'neutral';
    } else {
        if (val >= range.high) return 'good';
        if (val <= range.low) return 'bad';
        return 'neutral';
    }
};

export const getBenchmarkLevel = (
    kpi: BenchmarkData,
    userVal: string,
    priceTier: PriceTier
): number => {
    if (!userVal) return 2; // Default to average
    const val = parseFloat(userVal);
    if (isNaN(val)) return 2;

    const range = kpi.ranges[priceTier];
    const lowerIsBetter = ['cac', 'cac_payback', 'return_rate', 'cart_abandon', 'marketing_spend', 'churn_rate', 'email_unsub_rate', 'email_bounce_rate'].includes(kpi.id);

    // Define levels: 0=Disaster, 1=Bad, 2=Average, 3=Good, 4=Amazing
    if (lowerIsBetter) {
        if (val > range.high * 1.5) return 0;
        if (val > range.high) return 1;
        if (val > range.median) return 2;
        if (val <= range.low * 0.8) return 4;
        return 3;
    } else {
        if (val < range.low * 0.5) return 0;
        if (val < range.low) return 1;
        if (val < range.median) return 2;
        if (val >= range.high * 1.2) return 4;
        return 3;
    }
};

const MESSAGES = {
    0: [ // Needs significant improvement
        "This is a key area to focus on — we'll help you identify quick wins.",
        "Big opportunity here. Small changes can drive major results.",
        "This metric has strong improvement potential.",
        "Let's work on this together — it's a priority area.",
        "Room for growth here. Our analysis will show you how."
    ],
    1: [ // Below average
        "Slightly below benchmark — a few optimizations can help.",
        "You're close. Some targeted improvements will get you there.",
        "This metric could use some attention.",
        "There's potential here. Let's unlock it.",
        "A good focus area for your next optimization sprint."
    ],
    2: [ // Average
        "Right at the industry average — solid foundation.",
        "On par with the market. Room to stand out.",
        "Matching industry standards. Ready to go further?",
        "A stable baseline. Let's push for above-average.",
        "Good starting point. Small tweaks can elevate this."
    ],
    3: [ // Good
        "Above average — you're doing well here! 👏",
        "Strong performance. Keep up the momentum.",
        "Better than most. Nice work!",
        "Looking good! You're ahead of the curve.",
        "Solid results. This is working for you."
    ],
    4: [ // Excellent
        "Excellent! You're among top performers. 🚀",
        "Outstanding results. Industry-leading performance.",
        "Top tier. This is best-in-class territory.",
        "Impressive! You're setting the benchmark. 🏆",
        "Exceptional performance. Others should learn from you."
    ]
};

export const getHumorousMessage = (kpiId: string, level: number): string => {
    // Deterministic selection based on KPI ID and Level
    // This ensures the message is stable for a specific KPI at a specific level,
    // but varies across different KPIs.
    const safeLevel = Math.max(0, Math.min(4, Math.floor(level))) as keyof typeof MESSAGES;
    const msgIndex = (kpiId.charCodeAt(0) + kpiId.length + safeLevel) % 5;
    return MESSAGES[safeLevel][msgIndex];
};
