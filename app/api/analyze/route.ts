import { NextResponse } from 'next/server';
import { z } from 'zod';
import { retailBenchmarks, PriceTier, Industry } from '@/data/retailBenchmarks';

export const runtime = 'nodejs';

// Zod schema for request validation
const AnalysisSchema = z.object({
    userValues: z.record(z.string()),
    priceTier: z.enum(['Budget', 'Mid-Range', 'Luxury']),
    industry: z.enum(['Fashion', 'Home', 'Beauty', 'Electronics'])
});

export async function POST(request: Request) {
    // Validate request body first
    let userValues: Record<string, string>;
    let priceTier: PriceTier;
    let industry: Industry;

    try {
        const body = await request.json();
        const validated = AnalysisSchema.parse(body);
        userValues = validated.userValues;
        priceTier = validated.priceTier;
        industry = validated.industry;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to parse request', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 400 }
        );
    }

    // After validation, create the stream
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (type: 'log' | 'text' | 'error', data: string) => {
                const payload = JSON.stringify({ type, data });
                controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
            };

            try {
                send('log', 'Initializing analysis request...');

                const workspaceId = process.env.DUST_WORKSPACE_ID;
                const apiKey = process.env.DUST_API_KEY;
                const assistantId = process.env.DUST_ASSISTANT_ID;

                if (!workspaceId || !apiKey || !assistantId) {
                    throw new Error('Missing Dust API credentials');
                }

                send('log', 'Constructing prompt context...');

                let prompt = `You are a Senior Retail Strategy Consultant for B2C brands.
Your client is a ${industry} retailer with a ${priceTier} price positioning.

Here is their performance data compared to market benchmarks:
`;

                const selectedIndustry = (industry && retailBenchmarks[industry as Industry])
                    ? industry
                    : 'Fashion';

                const relevantBenchmarks = retailBenchmarks[selectedIndustry as Industry];

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

                send('log', 'Connecting to Dust AI Agent...');

                const createResponse = await fetch(`https://dust.tt/api/v1/w/${workspaceId}/assistant/conversations`, {
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
                        blocking: false,
                    }),
                });

                if (!createResponse.ok) {
                    const errorText = await createResponse.text();
                    throw new Error(`Failed to create conversation: ${createResponse.statusText} - ${errorText}`);
                }

                const createData = await createResponse.json();
                const conversationId = createData.conversation.sId;
                send('log', `Conversation created (ID: ${conversationId.slice(0, 8)}...)`);
                send('log', 'Waiting for agent response...');

                const eventsResponse = await fetch(`https://dust.tt/api/v1/w/${workspaceId}/assistant/conversations/${conversationId}/events`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    },
                });

                if (!eventsResponse.ok) {
                    const errorText = await eventsResponse.text();
                    throw new Error(`Failed to get events: ${eventsResponse.statusText} - ${errorText}`);
                }

                if (!eventsResponse.body) {
                    throw new Error('No response body from Dust events');
                }

                send('log', 'Stream connected. Receiving response...');

                const reader = eventsResponse.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let agentContent = ''; // Store agent message content when we receive it

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const rawEvent = JSON.parse(line.slice(6));
                                const event = rawEvent.data || rawEvent;
                                const eventType = event.type;

                                // Stream tokens as they arrive (if model supports streaming)
                                if (eventType === 'generation_tokens' && event.text) {
                                    send('text', event.text);
                                    agentContent += event.text;
                                }

                                // Agent message success - content might be here
                                if (eventType === 'agent_message_success') {
                                    send('log', 'Agent generation completed');
                                    if (event.message?.content) {
                                        agentContent = event.message.content;
                                    }
                                }

                                // Agent message done - fetch the complete conversation
                                if (eventType === 'agent_message_done') {
                                    if (event.status === 'success') {
                                        send('log', 'Agent completed. Waiting for content to be available...');

                                        // Wait a moment for the message to be fully persisted
                                        await new Promise(resolve => setTimeout(resolve, 1000));

                                        const conversationUrl = `https://dust.tt/api/v1/w/${workspaceId}/assistant/conversations/${conversationId}`;

                                        const convResponse = await fetch(conversationUrl, {
                                            method: 'GET',
                                            headers: {
                                                'Authorization': `Bearer ${apiKey}`,
                                            },
                                        });

                                        if (convResponse.ok) {
                                            const convData = await convResponse.json();

                                            // The content is in conversation.content which is a 2D array
                                            // content[0] = user messages, content[1] = agent messages, etc.
                                            const contentArrays = convData.conversation?.content || [];

                                            if (contentArrays.length === 0) {
                                                send('error', 'No content in conversation');
                                                controller.close();
                                                return;
                                            }

                                            // Find the agent message (usually in content[1][0])
                                            let agentMessage = null;
                                            for (const messageGroup of contentArrays) {
                                                const agent = messageGroup.find((m: any) => m.type === 'agent_message');
                                                if (agent) {
                                                    agentMessage = agent;
                                                    break;
                                                }
                                            }

                                            if (agentMessage?.content) {
                                                send('text', agentMessage.content);
                                                send('log', 'Analysis complete');
                                            } else {
                                                send('error', 'No agent message content found');
                                            }
                                        } else {
                                            const errText = await convResponse.text();
                                            send('error', `API error ${convResponse.status}: ${errText.substring(0, 100)}`);
                                        }
                                    } else {
                                        send('error', `Agent finished with status: ${event.status}`);
                                    }

                                    controller.close();
                                    return;
                                }

                                // Handle errors
                                if (eventType === 'agent_error') {
                                    const errorMsg = event.error?.message || event.message || 'Agent error occurred';
                                    send('error', errorMsg);
                                    controller.close();
                                    return;
                                }

                            } catch (e: any) {
                                // Silently ignore parse errors from incomplete chunks
                            }
                        }
                    }
                }

                // If we finish without getting content
                if (agentContent) {
                    send('text', agentContent);
                }
                send('log', 'Stream ended');
                controller.close();

            } catch (error: any) {
                send('error', error.message || 'An unexpected error occurred');
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
