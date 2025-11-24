import { BenchmarkData, PriceTier } from '@/data/retailBenchmarks';

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
    const lowerIsBetter = ['cac', 'return_rate', 'cart_abandon', 'marketing_spend', 'churn_rate'].includes(kpi.id);

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
    const lowerIsBetter = ['cac', 'return_rate', 'cart_abandon', 'marketing_spend', 'churn_rate'].includes(kpi.id);

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
    0: [ // Disaster
        "Ouch. Let's pretend this didn't happen. 🙈",
        "My grandma gets better numbers. And she doesn't have a website.",
        "Are you trying to lose money? Because it's working.",
        "I've seen better stats on a broken calculator.",
        "This is a safe space, but... wow."
    ],
    1: [ // Bad
        "Room for improvement. A lot of it. 😬",
        "Not quite there yet. Keep pushing!",
        "You're leaving money on the table.",
        "Competitors are eating your lunch right now.",
        "Time to roll up those sleeves."
    ],
    2: [ // Average
        "Average. Just like everyone else. 😐",
        "Middle of the pack. Safe, but boring.",
        "Not bad, not great. Just... okay.",
        "You exist. That's a start.",
        "Perfectly adequate. If you like adequate."
    ],
    3: [ // Good
        "Not bad! You might actually know what you're doing. 👏",
        "Solid numbers. Respect.",
        "You're beating the average. Nice.",
        "Looking good! Keep it up.",
        "Finally, some green numbers!"
    ],
    4: [ // Amazing
        "Wow. Are you sure? Cut your salary and take stock options! 🚀",
        "Unicorn status pending. 🦄",
        "Stop showing off. (Just kidding, don't stop).",
        "You're crushing it. Teach us your ways.",
        "Absolute legend. 🏆"
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
