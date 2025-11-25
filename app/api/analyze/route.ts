import { NextResponse } from 'next/server';
import { z } from 'zod';
import { benchmarks, PriceTier, Industry } from '@/data/benchmarks';

export const runtime = 'nodejs';
// Reduced timeout - this endpoint now returns immediately
export const maxDuration = 10;

// Zod schema for request validation
const AnalysisSchema = z.object({
    userValues: z.record(z.string()),
    priceTier: z.enum(['Budget', 'Mid-Range', 'Luxury']),
    industry: z.enum([
        // B2C Retail
        'Fashion', 'Home', 'Beauty', 'Electronics', 'Sports', 'Family', 'Food', 'Luxury',
        // B2B
        'SaaS', 'Services', 'Manufacturing', 'Wholesale'
    ])
});

export async function POST(request: Request) {
    try {
        // Validate request body
        const body = await request.json();
        const { userValues, priceTier, industry } = AnalysisSchema.parse(body);

        // Get Dust.tt credentials
        const workspaceId = process.env.DUST_WORKSPACE_ID;
        const apiKey = process.env.DUST_API_KEY;
        const assistantId = process.env.DUST_ASSISTANT_ID;

        if (!workspaceId || !apiKey || !assistantId) {
            return NextResponse.json(
                { error: 'Missing Dust API credentials' },
                { status: 500 }
            );
        }

        // Determine B2B or B2C
        const b2bIndustries = ['SaaS', 'Services', 'Manufacturing', 'Wholesale'];
        const isB2B = b2bIndustries.includes(industry);
        const businessType = isB2B ? 'B2B' : 'B2C Retail';

        // Construct prompt
        let prompt = `You are a Senior ${isB2B ? 'B2B Marketing' : 'Retail Strategy'} Consultant.
Your client is a ${industry} company in the ${businessType} sector with a ${priceTier} price positioning.

Here is their performance data compared to market benchmarks:
`;

        const selectedIndustry = (industry && benchmarks[industry as Industry])
            ? industry
            : 'Fashion';

        const relevantBenchmarks = benchmarks[selectedIndustry as Industry];

        relevantBenchmarks.forEach((kpi) => {
            const range = kpi.ranges[priceTier as PriceTier];
            const userVal = userValues[kpi.id];

            if (userVal) {
                prompt += `- ${kpi.name}: User Value = ${userVal}${kpi.unit} (Market: Low ${range.low}, Median ${range.median}, High ${range.high})\n`;
            }
        });

        prompt += `

Please analyze this data and provide a strategic report in Markdown format.
Structure your response exactly as follows:

# Executive Summary
(2-3 sentences highlighting the overall health and biggest opportunity. Be direct.)

# Traffic Light Analysis
- **Strengths**: (List 2 metrics where they excel and *why* it matters for revenue/growth)
- **Critical Gaps**: (List 2 metrics where they lag significantly and the *business impact*)

# Strategic Recommendations
Provide 3 specific, actionable initiatives to improve performance. Focus on CRM, Automation, and Channel Mix (Email/SMS).
1. **[Action Title]**: [Description with specific tactics]
2. **[Action Title]**: [Description with specific tactics]
3. **[Action Title]**: [Description with specific tactics]

Tone: Professional, insightful, direct. Avoid generic advice.`;

        // Create conversation with Dust (non-blocking)
        const createResponse = await fetch(
            `https://dust.tt/api/v1/w/${workspaceId}/assistant/conversations`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: {
                        content: prompt,
                        mentions: [{ configurationId: assistantId }],
                        context: {
                            timezone: "Europe/Paris",
                            username: "KPI_Tool_User"
                        }
                    },
                    blocking: false,  // Non-blocking: return immediately
                }),
            }
        );

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            return NextResponse.json(
                { error: `Failed to create conversation: ${createResponse.statusText} - ${errorText}` },
                { status: 502 }
            );
        }

        const createData = await createResponse.json();
        const conversationId = createData.conversation.sId;

        // Return immediately with conversation ID
        return NextResponse.json({
            status: 'created',
            conversationId,
            message: 'Analysis started. Poll /api/analyze/' + conversationId + ' for results.'
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to parse request', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
